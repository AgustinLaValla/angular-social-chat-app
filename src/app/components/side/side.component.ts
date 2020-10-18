import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from 'src/app/services/socket.service';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit, OnDestroy {

  public user: any;
  public userData: any;
  public totalPosts: number = 0;

  private postsRefreshListener$ = new Subscription();
  private usersRefreshListener$ = new Subscription();

  constructor(
    private tokenService: TokenService,
    private userService: UsersService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.initSocketListeners();
  };

  getUser() {
    this.userService.getUserById(this.user._id).subscribe({
      next: ({user, totalPosts}) => (
        this.userData = user,
        this.totalPosts = totalPosts
      )
    });
  };

  initSocketListeners() {
    this.postsRefreshListener$ = this.socketService.listen('refresh-posts').pipe(
      tap({
        next: () => this.getUser()
      })
    ).subscribe();
    
    this.usersRefreshListener$ = this.socketService.listen('friend-list-refresh').pipe(
      tap({
        next: () => this.getUser()
      })
    ).subscribe();
  };

  ngOnDestroy(): void {
    this.postsRefreshListener$.unsubscribe();
    this.usersRefreshListener$.unsubscribe();
  };

};
