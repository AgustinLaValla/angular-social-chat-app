import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public currentUser: any;
  public notifications = [];

  private pageRefreshObs$ = new Subscription();

  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private socketService: SocketService,
    private uiService:UiService) { }

  ngOnInit(): void {
    this.uiService.showNavContent.next(true);
    this.uiService.showSidebar = true;
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

  timeFromNow(time: moment.Moment) {
    return moment(time).fromNow();
  };

  marknotification(notification) {
    if(notification.read) return;
    this.usersService.markNotification(notification._id).subscribe(() => {
      this.socketService.emit('friend-list-refresh');
    });
  };

  deleteNotification(notification) {
    this.usersService.markNotification(notification._id, true).subscribe((resp) => {
      this.socketService.emit('friend-list-refresh');
    });
  };

  ngOnDestroy(): void {
    this.pageRefreshObs$.unsubscribe();
  };

};
