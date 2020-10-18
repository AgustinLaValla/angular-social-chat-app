import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { UiService } from 'src/app/services/ui.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public currentUser: any;
  public notifications = [];

  private isLoadingSub$ = new Subscription();
  public isLoading: boolean = false;

  private pageRefreshObs$ = new Subscription();

  constructor(
    private tokenService: TokenService,
    public usersService: UsersService,
    private socketService: SocketService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.uiService.showNavContent.next(true);
    this.uiService.showSidebar = true;
    this.currentUser = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.refreshPageListener();
    this.setLoadingListener();
  };

  getUser() {
    this.usersService.getUserById(this.currentUser._id).subscribe({
      next: ({user}) => (this.notifications = user.notifications)
    });
  };

  refreshPageListener() {
    this.pageRefreshObs$ = this.socketService.listen('friend-list-refresh').subscribe({
      next: () => this.getUser()
    });
  };

  timeFromNow(time: moment.Moment) {
    return moment(time).fromNow();
  };

  marknotification(notification) {
    if (notification.read) return;
    this.uiService.loadingSubjet.next(true);
    this.usersService.markNotification(notification._id).pipe(
      tap({
        next: () => (
          this.socketService.emit('friend-list-refresh'),
          this.uiService.loadingSubjet.next(false)
        )
      })
    ).subscribe();
  };

  deleteNotification(notification) {
    this.uiService.loadingSubjet.next(true);
    this.usersService.markNotification(notification._id, true).pipe(
      tap({
        next: () => (
          this.socketService.emit('friend-list-refresh'),
          this.uiService.loadingSubjet.next(false)
        )
      })
    ).subscribe();
  };

  setLoadingListener() {
    this.isLoadingSub$ = this.uiService.loadingSubjet.subscribe({
      next: isLoading => this.isLoading = isLoading
    });
  }

  ngOnDestroy(): void {
    this.pageRefreshObs$.unsubscribe();
    this.isLoadingSub$.unsubscribe();
  };

};
