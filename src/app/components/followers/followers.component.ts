import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { map, tap } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit, OnDestroy {

  private currentUser: any;
  public followers = [];
  private following = [];

  private refreshListObs$ = new Subscription();
  private isLoadingSubs$ = new Subscription();
  public isLoading: boolean = false;

  private onlineUsersObs$ = new Subscription();
  private onlineUsers: any[] = [];

  constructor(
    private tokenService: TokenService,
    public usersService: UsersService,
    private socketService: SocketService,
    private uiService: UiService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadingListener();
    this.getUsersOnline();
    this.uiService.showSidebar = true;
    this.currentUser = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.followerListRefreshListener();
  };

  getUser() {
    this.uiService.loadingSubjet.next(true);
    this.usersService.getUserById(this.currentUser._id).pipe(
      map(({user}) => {
        this.followers = user.followers
        this.following = user.following
      }),
      tap({ next: () => this.uiService.loadingSubjet.next(false) })
    ).subscribe();
  };

  checkInFollowersArray(id: string) {
    return this.following.find(user => user.userFollowed._id === id);
  };


  followUser(id: string): void {
    this.uiService.loadingSubjet.next(true);
    this.usersService.followUser(id).pipe(
      tap({ next: () => this.socketService.emit('friend-list-refresh') })
    ).subscribe();
  };


  unfollowUser(id: string) {
    this.uiService.loadingSubjet.next(true);
    this.usersService.unFollowUser(id).pipe(
      tap({ next: () => this.socketService.emit('friend-list-refresh') })
    ).subscribe();
  };

  followerListRefreshListener() {
    this.refreshListObs$ = this.socketService.listen('friend-list-refresh').pipe(
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
    this.refreshListObs$.unsubscribe();
    this.isLoadingSubs$.unsubscribe();
    this.onlineUsersObs$.unsubscribe();
  };

};
