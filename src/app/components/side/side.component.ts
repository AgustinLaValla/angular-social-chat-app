import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { PostsService } from 'src/app/services/posts.service';
import { SocketService } from 'src/app/services/socket.service';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit, OnDestroy {

  private user: any;
  public userData:any;
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
    this.userService.getUserById(this.user._id).subscribe((userData) => this.userData = userData);
  };

  initSocketListeners() {
    this.postsRefreshListener$ = this.socketService.listen('refresh-posts').subscribe(() => this.getUser());
    this.usersRefreshListener$ = this.socketService.listen('friend-list-refresh').subscribe(() => this.getUser());
  };

  ngOnDestroy(): void {
    this.postsRefreshListener$.unsubscribe();
    this.usersRefreshListener$.unsubscribe();
  };

}
