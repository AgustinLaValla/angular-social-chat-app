import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';

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
  public isLoading:boolean = false;

  constructor(private tokenService: TokenService,
    private userService: UsersService,
    private socketService: SocketService,
    private uiService:UiService
  ) { }

  ngOnInit(): void {
    this.loadingListener();
    this.uiService.showNavContent.next(true);
    this.uiService.showSidebar = true;
    this.currentUser = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.friendListRefreshListener();
  };

  getUser() {
    this.uiService.loadingSubjet.next(true);
    this.userService.getUserById(this.currentUser._id).subscribe((user) => {
      this.usersFollowed = user.following;
      this.uiService.loadingSubjet.next(false);
    });
  };

  unfollowUser(id: string) {
    this.uiService.loadingSubjet.next(true);
    this.userService.unFollowUser(id).subscribe(() => {
      this.socketService.emit('friend-list-refresh');
    });
  };

  friendListRefreshListener() {
    this.listRefreshObs$ = this.socketService.listen('friend-list-refresh').subscribe(() => {
      this.getUser();
    });
  };

  loadingListener() { 
    this.isLoadingSubs$ = this.uiService.loadingSubjet.subscribe(isLoading => this.isLoading = isLoading);
  };


  ngOnDestroy(): void {
    this.listRefreshObs$.unsubscribe();
  };

};
