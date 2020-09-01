import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { SocketService } from 'src/app/services/socket.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';

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
  public isLoading:boolean = false;

  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private socketService: SocketService,
    private uiService:UiService) { }

  ngOnInit(): void {
    this.loadingListener();
    this.uiService.showSidebar = true;
    this.currentUser = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.followerListRefreshListener();
  };

  getUser() {
    this.uiService.loadingSubjet.next(true);
    this.usersService.getUserById(this.currentUser._id).subscribe((user) => {
      this.followers = user.followers;
      this.following = user.following;
      this.uiService.loadingSubjet.next(false);
    });
  };

  checkInFollowersArray(id: string) {
    const following = _.find(this.following, ['userFollowed._id', id]);
    if(following) { 
      return true;
    } else { 
      return false;
    };
  };

  
  followUser(id: string): void {
    this.uiService.loadingSubjet.next(true);
    this.usersService.followUser(id).subscribe((resp) => {
      this.socketService.emit('friend-list-refresh');
    });
  };

  
  unfollowUser(id: string) {
    this.uiService.loadingSubjet.next(true);
    this.usersService.unFollowUser(id).subscribe(() => {
      this.socketService.emit('friend-list-refresh');
    });
  };

  followerListRefreshListener() { 
    this.refreshListObs$ = this.socketService.listen('friend-list-refresh').subscribe(() => {
      this.getUser();
    });
  };

  loadingListener() { 
    this.isLoadingSubs$ = this.uiService.loadingSubjet.subscribe(isLoading => this.isLoading = isLoading);
  };

  ngOnDestroy(): void {
    this.refreshListObs$.unsubscribe();
  };

};
