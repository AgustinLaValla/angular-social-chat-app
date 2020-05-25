import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UiService } from 'src/app/services/ui.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import * as M from 'materialize-css';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Input() public username: string;

  private user: any;

  public userData = [];

  private navContentSubs$ = new Subscription();
  public showNavContent: boolean = true;

  private pageRefreshObs$ = new Subscription();

  public showNotificationBadge: boolean = false;

  constructor(private tokenService: TokenService,
    private router: Router,
    private uiService: UiService,
    private userService: UsersService,
    private socketService: SocketService) { }

  ngOnInit(): void {

    const notificatoinsDropDownMenu = document.querySelector('.dropdown-trigger');
    new M.Dropdown(notificatoinsDropDownMenu, { alignment: 'right', hover: true, coverTrigger: false });

    this.user = this.tokenService.getTokenPayload().user;

    this.getUser();

    this.refreshPageListener();

    this.navContentSubs$ = this.uiService.showNavContent.subscribe(show => this.showNavContent = show);
  }

  getUser() {
    this.userService.getUserById(this.user._id).subscribe(user => {
      this.userData = user.notifications.reverse()
    }, error => {
      if (!error.error.token) {
        this.tokenService.deleteToken();
        this.tokenService.deleteUserName();
        this.router.navigate(['/login']);
      };
    });
  };

  fromNow(date: moment.Moment) {
    return moment(date).fromNow();
  };

  markAll() {
    this.userService.markAllAsRead().subscribe((resp) => {
      console.log(resp);
      this.socketService.emit('friend-list-refresh');
    });
  }

  unreadNotifications() {
    return this.userData.filter(notification => !notification.read)
  };

  refreshPageListener() {
    this.pageRefreshObs$ = this.socketService.listen('friend-list-refresh').subscribe(() => {
      this.getUser();
    });
  };

  logout() {
    this.tokenService.deleteToken();
    this.tokenService.deleteUserName();
    this.router.navigate(['/login']);
  };

  ngOnDestroy(): void {
    this.navContentSubs$.unsubscribe();
    this.pageRefreshObs$.unsubscribe();
  };

}
