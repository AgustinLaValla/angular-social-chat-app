import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import * as moment from 'moment/moment';
import * as M from 'materialize-css';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { PostModalService } from '../post-modal/post-modal.service';
import { UsersService } from 'src/app/services/users.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  public posts: any[] = [];
  public username: string;
  public userId: string;

  private socketListener = new Subscription();

  public postId: string;

  private modal: any;

  constructor(
    private postsService: PostsService,
    private socketService: SocketService,
    private router: Router,
    private tokenService: TokenService,
    public postModalService: PostModalService,
    public userService: UsersService
  ) { }

  ngOnInit(): void {
    this.setSocketListener();
    this.getAllPosts();
    this.username = this.tokenService.getUserName();
    this.userId = this.tokenService.getTokenPayload().user._id;

    this.modal = document.querySelector('.modal');
    new M.Modal(this.modal);
  };

  getAllPosts() {
    this.postsService.getAllPost().subscribe({
      next: (resp) => (
        this.posts = resp.posts,
        this.postsService.totalPost = resp.total
      ),
      error: error => {
        if (!error.error.token) {
          this.tokenService.deleteToken();
          this.tokenService.deleteUserName();
          this.router.navigate(['/login']);
        }
      }
    })
  };

  likedPost(post: any) {
    this.postsService.addLike(post).pipe(
      tap({
        next: () => {
          this.socketService.emit('refresh-posts', {});
        }
      })
    ).subscribe();
  };

  checkInLikesArray(array: { username, _id }[]) {
    return array.find(data => data.username === this.username);
  }

  timeFromNow(time: moment.Moment) {
    return moment(time).fromNow();
  };


  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const scrollingElement = event.target.scrollingElement;
    if (scrollingElement.scrollTop + scrollingElement.clientHeight >= scrollingElement.scrollHeight - 1) {
      if (this.postsService.postLimit < this.postsService.totalPost) {
        this.postsService.postLimit += 10;
        this.getAllPosts();
      }
    } else {
      if (window.innerWidth <= 992) {
        if (scrollingElement.scrollTop + scrollingElement.clientHeight >= scrollingElement.scrollHeight - 50) {
          if (this.postsService.postLimit < this.postsService.totalPost) {
            this.postsService.postLimit += 10;
            this.getAllPosts();
          }
        }
      }
    }
  }

  setSocketListener() {
    this.socketListener = this.socketService.listen('refresh-posts').subscribe({
      next: ({ newPostAdded }) => {
        if (newPostAdded) {
          this.postsService.postLimit += 1;
        }
        this.getAllPosts()
      }
    });
  }

  ngOnDestroy(): void {
    this.socketListener.unsubscribe();
    this.postsService.postLimit = 10;
    this.postsService.totalPost = 0;
  };

}
