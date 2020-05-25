import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from 'src/app/services/socket.service';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {

  public posts: any;
  public like:boolean;
  private username:string;

  constructor(
    private postsService: PostsService,
    private tokenService: TokenService,
    private socketService:SocketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.tokenService.getUserName();
    this.getAllPosts();
  };

  getAllPosts() {
    this.postsService.getTopPosts().subscribe((posts) => {
      this.posts = posts
      console.log(this.posts);
    }, error => {
      if (!error.error.token) {
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

}
