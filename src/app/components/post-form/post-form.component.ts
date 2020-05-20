import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  public postForm: FormGroup;

  constructor(private postService: PostsService, 
              private fb: FormBuilder, 
              private socketService:SocketService) { }

  ngOnInit(): void {
    this.initForm();
   };


  initForm() {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    });
  };

  submitPost() {
    if(!this.postForm.value.post.length) return; 
    this.postService.addPost(this.postForm.value).subscribe((resp) => {
      this.socketService.emit('refresh-posts', {data: 'This is an event test'});
      this.postForm.reset();
    });
  };

}
