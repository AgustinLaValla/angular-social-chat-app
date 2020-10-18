import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import * as M from 'materialize-css';
import * as moment from 'moment/moment';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { PostModalService } from '../post-modal/post-modal.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, AfterViewInit, OnDestroy {

  private socketListener = new Subscription();

  public postTab: boolean = false;
  public followingTab: boolean = false;
  public followersTab: boolean = false;
  public posts = [];
  public following = [];
  public followers = [];

  public user: any;
  private userId: string;

  public currentUserId: string;
  private viwedUserId: string;

  private postsLimit: number = 10;
  private totalPosts: number = 0;

  constructor(
    private uiService: UiService,
    public userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private tokenServie: TokenService,
    public postModelService: PostModalService,
    private socketService: SocketService
  ) {
    this.uiService.showSidebar = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      tap({
        next: params => (
          this.getUser(params['id']),
          this.userId = params['id']
        )
      }),
      map(params => this.viwedUserId = params['id']),
    ).subscribe();

    this.postTab = true;
    const tabs = document.querySelector('.tabs');
    new M.Tabs(tabs, {});

    this.currentUserId = this.tokenServie.getTokenPayload().user._id;

    this.refreshListener();

  };

  ngAfterViewInit(): void {
    this.uiService.showNavContent.next(false);
  };

  getUser(id: string) {
    this.userService.getUserById(id, this.postsLimit).pipe(
      map((resp) => {
        this.user = resp.user;
        this.posts = resp.user.posts;
        this.following = resp.user.following;
        this.followers = resp.user.followers;
        this.totalPosts = resp.totalPosts
      })
    ).subscribe();
  };

  changeTab(value: string) {
    if (value === 'posts') {
      this.postTab = true;
      this.followingTab = false;
      this.followersTab = false;
    } else if (value === 'following') {
      this.postTab = false;
      this.followingTab = true;
      this.followersTab = false;
    } else {
      this.postTab = false;
      this.followingTab = false;
      this.followersTab = true;
    };
  };

  fromNow(date: Date) {
    return moment(date).fromNow();
  };


  refreshListener() {
    this.socketListener = this.socketService.listen('refresh-posts').subscribe({
      next: () => this.getUser(this.viwedUserId)
    });
  };

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const scrollingElement = event.target.scrollingElement;
    if (scrollingElement.scrollTop + scrollingElement.clientHeight >= scrollingElement.scrollHeight - 1) {
      if (this.postsLimit < this.totalPosts) {
        this.postsLimit += 10;
        this.getUser(this.userId)
      }
    }
  }

  ngOnDestroy() {
    this.socketListener.unsubscribe();
  }

};
