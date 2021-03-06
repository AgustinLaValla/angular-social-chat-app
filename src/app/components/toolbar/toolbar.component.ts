import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UiService } from 'src/app/services/ui.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import * as moment from 'moment/moment';
import * as M from 'materialize-css';
import { SocketService } from 'src/app/services/socket.service';
import { MessageService } from 'src/app/services/message.service';
import { filter, map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() public username: string;

  private user: any;
  public userData: any;

  public userNotifications = [];
  public chatList = [];

  private navContentSubs$ = new Subscription();
  private chatRefreshListener$ = new Subscription();
  public showNavContent: boolean = true;
  public imageId: string;
  public imageVersion: string;

  private pageRefreshObs$ = new Subscription();

  public showNotificationBadge: boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private uiService: UiService,
    public userService: UsersService,
    private socketService: SocketService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    const notificatoinsDropDownMenu = document.querySelector('.follow-notifications');
    const chatNotificationDropDownMenu = document.querySelector('.chat-notifications')
    new M.Dropdown(notificatoinsDropDownMenu, { alignment: 'left', hover: false, coverTrigger: false, });
    new M.Dropdown(chatNotificationDropDownMenu, { alignment: 'left', hover: false, coverTrigger: false, });

    this.user = this.tokenService.getTokenPayload().user;

    this.socketService.emit('online', { room: 'global', username: this.tokenService.getUserName() });

    this.getUser();

    this.refreshListener();

    this.navContentSubs$ = this.uiService.showNavContent.subscribe(show => this.showNavContent = show);
  };

  ngAfterViewInit(): void {
    this.socketService.listen('usersOnline').subscribe({
      next: data => this.messageService.onlineUsers.next(data)
    });
  };

  getUser() {
    this.userService.getUserById(this.user._id).pipe(
      filter(({user}) => user !== null || user !== undefined),
      map(({user}) => {
        this.userData = user;
        this.userNotifications = user.notifications.reverse();
        this.chatList = user.chatList;
        this.unreadChatMessages();
      }),
      catchError(error =>
        !error.error.token
          ?
          of(
            this.tokenService.deleteToken(),
            this.tokenService.deleteUserName(),
            this.router.navigate(['/login'])
          )
          :
          null
      )
    ).subscribe();
  };

  fromNow(date: moment.Moment) {
    return moment(date).fromNow();
  };

  markAll() {
    this.userService.markAllAsRead().subscribe({
      next: () => this.socketService.emit('friend-list-refresh')
    });
  };

  unreadNotifications() {
    return this.userNotifications.filter(notification => !notification.read);
  };

  unreadChatMessages() {
    return this.chatList.filter(chat => {
      const receiver = chat.msgId.message[chat.msgId.message.length - 1];
      if (
        this.router.url !== this.receiverParamsString(receiver.senderId) &&
        receiver.senderId !== this.user._id &&
        receiver.receivername == this.username
      ) {
        return !receiver.isRead;
      };
    });
  };

  receiverParamsString(id: string) {
    return `/chat/${id}`;
  }

  messageDate(data: Date) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

  markAndGoToChatPage(id: string, username) {
    this.router.navigate(['/chat', id]);
    this.messageService.markMessageAsRead(this.username, username).subscribe({
      next: () => this.socketService.emit('friend-list-refresh')
    });
  };

  markAllMessagesAsRead() {
    this.messageService.markAllMessagesAsRead().subscribe({
      next: () => this.socketService.emit('friend-list-refresh')
    });
  }

  refreshListener() {
    this.chatRefreshListener$ = this.socketService.listen('refresh-chat').subscribe({
      next: () => this.getUser()
    });
    this.pageRefreshObs$ = this.socketService.listen('friend-list-refresh').subscribe({
      next: () => this.getUser()
    });
  };

  logout() {
    this.tokenService.deleteToken();
    this.tokenService.deleteUserName();
    this.socketService.emit('logout');
    this.router.navigate(['/login']);
    if (this.user.google) {
      this.authService.auth2.disconnect().then(() => console.log('Signed out from google'));
    }
  };

  ngOnDestroy(): void {
    this.navContentSubs$.unsubscribe();
    this.pageRefreshObs$.unsubscribe();
    this.chatRefreshListener$.unsubscribe();
  };

};
