import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {

  public commentForm: FormGroup
  private postId: string;

  public commentsArray: any[] = [];

  public post:any;

  private paramsListener$ = new Subscription();
  private commentRefreshListener$ = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private fb: FormBuilder,
    private postService: PostsService,
    private socketService:SocketService) { }

  ngOnInit(): void {
    this.uiService.showNavContent.next(false);
    this.initForm();
    this.getPostIdFromRoutesNodes();
    this.initCommentRefreshListener();
  };

  getPostIdFromRoutesNodes() {
    this.paramsListener$ = this.activatedRoute.params.subscribe((params: Params) => {
      this.postId = params['id'];
      this.getPost();
    });
  };

  initForm() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  };

  addComment() {
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe((resp) => {
      this.commentForm.reset();
      this.socketService.emit('refresh-posts-comments');
    });
  };

  getPost() {
    this.postService.getPost(this.postId).subscribe((post) => {
      this.commentsArray = post.comments.reverse();
      this.post = post;
    });
  };

  initCommentRefreshListener() {
    this.commentRefreshListener$ = this.socketService.listen('refresh-posts-comments').subscribe(() => {
      this.getPost();
    });
  };
  
  timeFromNow(time: Date) {
    return moment(time).fromNow();
  };


  ngOnDestroy(): void {
    this.paramsListener$.unsubscribe();
    this.commentRefreshListener$.unsubscribe();
  };

}
