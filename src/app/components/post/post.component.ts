import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import * as moment from 'moment/moment';
import { SocketService } from 'src/app/services/socket.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  public like: boolean = false;
  public posts: any[] = [];
  public username: string;

  private socketListener = new Subscription();

  constructor(
    private postsService: PostsService,
    private socketService: SocketService,
    private router:Router,
    private tokenService:TokenService) {
    this.socketListener = this.socketService.listen('refresh-posts').subscribe(() => this.getAllPosts());
  }

  ngOnInit(): void {
    this.getAllPosts();
    this.username = this.tokenService.getUserName();
    console.log(this.username)
  };

  getAllPosts() {
    this.postsService.getAllPost().subscribe((posts) => {
      this.posts = posts
    }, error => {
      if(!error.error.token) { 
        this.tokenService.deleteToken();
        this.tokenService.deleteUserName();
        this.router.navigate(['/login']);
      };
    });
  };

  likedPost(post: any) {
    this.like = !this.like;
    this.postsService.addLike(post).subscribe(resp => {
      this.socketService.emit('refresh-posts', {});
    });
  };

  checkInLikesArray(array) {
    return _.some(array, { username: this.username });
  }

  timeFromNow(time: moment.Moment) {
    return moment(time).fromNow();
  };


  openCommentBox(post) { 
    this.router.navigate(['post', post._id]);    
  }

  ngOnDestroy(): void {
    this.socketListener.unsubscribe();
  }

}
