import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from 'src/app/services/socket.service';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit, OnDestroy {

  public posts: any;
  public like: boolean;
  private username: string;

  constructor(
    private postsService: PostsService,
    private tokenService: TokenService,
    private socketService: SocketService,
    public userService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.tokenService.getUserName();
    this.getAllPosts();
  };

  getAllPosts() {
    this.postsService.getTopPosts().pipe(
      map((resp) => (
        this.posts = resp.posts,
        this.postsService.totalTopPost = resp.total
      )),
      catchError(
        error => !error.error.token
          ? of(
            this.tokenService.deleteToken(),
            this.tokenService.deleteUserName(),
            this.router.navigate(['/login'])
          )
          : null
      )
    ).subscribe();
  };

  likedPost(post: any) {
    this.like = !this.like;
    this.postsService.addLike(post).pipe(
      tap({
        next: () => this.socketService.emit('refresh-posts', {})
      })
    ).subscribe();
  };

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const scrollingElement = event.target.scrollingElement;
    if (scrollingElement.scrollTop + scrollingElement.clientHeight >= scrollingElement.scrollHeight) {
      if (this.postsService.topPostsLimit < this.postsService.totalTopPost) {
        this.postsService.topPostsLimit += 10;
        this.getAllPosts();
      } else {
        if (window.innerWidth <= 992) {
          if (scrollingElement.scrollTop + scrollingElement.clientHeight >= scrollingElement.scrollHeight - 50) {
            if (this.postsService.topPostsLimit < this.postsService.totalTopPost) {
              this.postsService.postLimit += 10;
              this.getAllPosts();
            }
          }
        }
      }
    }
  }

  checkInLikesArray(array: { username, _id }[]) {
    return array.find(data => data.username === this.username);
  }

  timeFromNow(time: moment.Moment) {
    return moment(time).fromNow();
  };


  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }

  ngOnDestroy(): void {
    this.postsService.topPostsLimit = 10;
    this.postsService.totalTopPost = 0;
  }

}
