import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { map, tap } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit, OnDestroy {

  private currentUser: any;

  public usersFollowed: any[] = [];

  private listRefreshObs$ = new Subscription();

  private isLoadingSubs$ = new Subscription();
  public isLoading: boolean = false;

  private onlineUsersObs$ = new Subscription();
  private onlineUsers: any[] = [];

  constructor(
    private tokenService: TokenService,
    public userService: UsersService,
    private socketService: SocketService,
    private uiService: UiService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadingListener();
    this.getUsersOnline();
    this.uiService.showNavContent.next(true);
    this.uiService.showSidebar = true;
    this.currentUser = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.friendListRefreshListener();
  };

  getUser() {
    this.uiService.loadingSubjet.next(true);
    this.userService.getUserById(this.currentUser._id).pipe(
      map(({user}) => this.usersFollowed = user.following),
      tap({ next: () => this.uiService.loadingSubjet.next(false) })
    ).subscribe();
  };

  unfollowUser(id: string) {
    this.uiService.loadingSubjet.next(true);
    this.userService.unFollowUser(id).pipe(
      tap({ next: () => this.socketService.emit('friend-list-refresh') })
    ).subscribe();
  };

  friendListRefreshListener() {
    this.listRefreshObs$ = this.socketService.listen('friend-list-refresh').pipe(
      tap({ next: () => this.getUser() })
    ).subscribe();
  };

  loadingListener() {
    this.isLoadingSubs$ = this.uiService.loadingSubjet.subscribe({
      next: isLoading => this.isLoading = isLoading
    });
  };

  checkUserStatus(username: string) {
    return this.onlineUsers.find(user => user === username);
  };

  getUsersOnline() {
    this.onlineUsersObs$ = this.messageService.onlineUsers.subscribe({
      next: onlineUsers => this.onlineUsers = onlineUsers
    });
  };


  ngOnDestroy(): void {
    this.listRefreshObs$.unsubscribe();
    this.isLoadingSubs$.unsubscribe();
    this.onlineUsersObs$.unsubscribe();
  };

};
