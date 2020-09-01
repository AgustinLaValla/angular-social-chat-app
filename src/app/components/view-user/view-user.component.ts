import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import * as M from 'materialize-css';
import * as moment from 'moment/moment';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { PostModalService } from '../post-modal/post-modal.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';

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

  public currentUserId:string;
  private viwedUserId:string;

  constructor(
    private uiService: UiService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private tokenServie:TokenService,
    public postModelService:PostModalService,
    private socketService:SocketService
  ) {
    this.uiService.showSidebar = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.getUser(params['id']);
      this.viwedUserId = params['id'];
    });

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
    this.userService.getUserById(id).subscribe(user => {
      this.user = user;
      this.posts = user.posts;
      this.following = user.following;
      this.followers = user.followers;
    });
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

  fromNow(date:Date) { 
    return moment(date).fromNow();
  };


  refreshListener() { 
    this.socketListener = this.socketService.listen('refresh-posts').subscribe(() => this.getUser(this.viwedUserId));
  };

  ngOnDestroy() { 
    this.socketListener.unsubscribe();
  }

};
