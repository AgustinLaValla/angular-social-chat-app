import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit, OnDestroy {

  public users: any[] = [];

  public currentUser: any;
  public userFollowingArray: any[] = [];

  private onlineUsersObs$ = new Subscription();
  public onlineUsers = [];

  private refreshListenerSub$ = new Subscription();

  private isLoadingSubs$ = new Subscription();
  public isLoading: boolean = false;

  constructor(
    public usersService: UsersService,
    private tokenService: TokenService,
    private socketService: SocketService,
    private messageService: MessageService,
    private uiService: UiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.uiService.showNavContent.next(true);
    this.uiService.showSidebar = true;
    this.loadingListener();
    this.refreshListener();
    this.currentUser = this.tokenService.getTokenPayload().user;
    this.getUsers();
    this.getUser(this.currentUser._id);
    this.getUsersOnline();
  };

  getUsers(): void {
    this.uiService.loadingSubjet.next(true);
    this.usersService.getAllUsers().pipe(
      tap({
        next: users => (
          this.users = users,
          this.uiService.loadingSubjet.next(false)
        )

      })
    ).subscribe();
  };

  getUser(id: string) {
    this.usersService.getUserById(id).subscribe({
      next: ({user}) => this.userFollowingArray = user.following
    });
  };

  getUserByName(username: string) {
    this.usersService.getUserByUsername(username).subscribe(console.log);
  };

  followUser(id: string): void {
    this.uiService.loadingSubjet.next(true);
    this.usersService.followUser(id).pipe(
      tap({
        next: () => this.socketService.emit('friend-list-refresh')
      })
    ).subscribe();
  };

  checkInFollowingArray(id: string) {
    return this.userFollowingArray.some(user => user.userFollowed._id === id);
  };

  refreshListener() {
    this.refreshListenerSub$ = this.socketService.listen('friend-list-refresh').pipe(
      tap({
        next: () => {
          this.getUsers();
          this.getUser(this.currentUser._id);
        }
      })
    ).subscribe();
  };

  getUsersOnline() {
    this.onlineUsersObs$ = this.messageService.onlineUsers.subscribe({
      next: onlineUsers => this.onlineUsers = onlineUsers
    });
  };

  checkUserStatus(username: string) {
    return this.onlineUsers.find(user => user === username);
  };

  viewUser(user: any) {
    this.router.navigate(['/user/', user._id]);
    if (this.currentUser._id !== user._id) {
      this.usersService.viewProfileNotifications(user._id).pipe(
        tap({
          next: () => this.socketService.emit('friend-list-refresh')
        })
      ).subscribe();
    };
  };

  loadingListener() {
    this.isLoadingSubs$ = this.uiService.loadingSubjet.subscribe({
      next: isLoading => this.isLoading = isLoading
    });
  };

  ngOnDestroy(): void {
    this.refreshListenerSub$.unsubscribe();
    this.onlineUsersObs$.unsubscribe();
    this.isLoadingSubs$.unsubscribe();
  };

};
