import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import * as _ from 'lodash';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { MessageService } from 'src/app/services/message.service';

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

  constructor(private usersService: UsersService,
    private tokenService: TokenService,
    private socketService: SocketService,
    private messageService: MessageService,
    private uiService: UiService) { }

  ngOnInit(): void {
    this.uiService.showNavContent.next(true);
    this.uiService.showSidebar.next(true);
    this.refreshListener();
    this.currentUser = this.tokenService.getTokenPayload().user;
    this.getUsers();
    this.getUser(this.currentUser._id);
    this.getUsersOnline();
  };

  getUsers(): void {
    this.usersService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  };

  getUser(id: string) {
    this.usersService.getUserById(id).subscribe((user) => this.userFollowingArray = user.following);
  };

  getUserByName(username: string) {
    this.usersService.getUserByUsername(username).subscribe(console.log);
  };

  followUser(id: string): void {
    this.usersService.followUser(id).subscribe((resp) => {
      this.socketService.emit('friend-list-refresh');
    });
  };

  checkInFollowingArray(id: string) {
    const result = _.find(this.userFollowingArray, ['userFollowed._id', id]);
    if (result) {
      return true
    } else {
      return false;
    };
  };

  refreshListener() {
    this.refreshListenerSub$ = this.socketService.listen('friend-list-refresh').subscribe(() => {
      this.getUsers();
      this.getUser(this.currentUser._id);
    });
  };

  getUsersOnline() {
    this.onlineUsersObs$ = this.messageService.onlineUsers.subscribe(onlineUsers => {
       this.onlineUsers = onlineUsers;
    });
  };

  checkUserStatus(username:string) { 
    return this.onlineUsers.filter(user => user === username);
  };

  ngOnDestroy(): void {
    this.refreshListenerSub$.unsubscribe();
    this.onlineUsersObs$.unsubscribe();
  };

};
