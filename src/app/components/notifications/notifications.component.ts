import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public currentUser:any;
  public notifications = [];

  private pageRefreshObs$ = new Subscription();

  constructor(
    private tokenService:TokenService, 
    private usersService:UsersService,
    private socketService:SocketService) { }

  ngOnInit(): void { 
    this.currentUser = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.refreshPageListener();
  };

  getUser() { 
    this.usersService.getUserById(this.currentUser._id).subscribe((user) => {
      this.notifications = user.notifications;
      console.log(this.notifications);
    });
  };

  refreshPageListener() { 
    this.pageRefreshObs$ = this.socketService.listen('friend-list-refresh').subscribe(() => {
      this.getUser();
    });
  };

  ngOnDestroy(): void {
    this.pageRefreshObs$.unsubscribe();
  };

};
