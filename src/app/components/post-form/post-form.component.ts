import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  public postForm: FormGroup;

  constructor(private postService: PostsService, private fb: FormBuilder) { }

  ngOnInit(): void { }


  initForm() {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    })
  }

  submitPost() {
    this.postService.addPost(this.postForm.value).subscribe(console.log);
  };

}
