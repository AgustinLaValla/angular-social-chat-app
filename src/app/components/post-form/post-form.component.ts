import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { SocketService } from 'src/app/services/socket.service';
import { FileUploader } from 'ng2-file-upload';
import { URL } from '../../../config/url.config';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  public postForm: FormGroup;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  public selectedFile:any;

  @ViewChild('imageDescription') imageDescription:ElementRef;

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
    if(!this.postForm.value.post.length && !this.selectedFile) return;

    let body;

    if(!this.selectedFile!) {
      body = { ...this.postForm.value };
    };
    if(this.selectedFile) { 
      body = { ...this.postForm.value, image: this.selectedFile }
    };
    this.postService.addPost(body).subscribe((resp) => {
      this.socketService.emit('refresh-posts', {data: 'This is an event test'});
      this.postForm.reset();
      this.imageDescription.nativeElement.value = null;
      this.selectedFile = null;
    });

  };

  async onFileSelected(event: FileList) {
    const file: File = event[0];
    try {
      const result = await this.readAsBase64(file);
      this.selectedFile = result;
    } catch (error) {
      console.log(error);
    };
  };

  readAsBase64(file: File) {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', (event) => reject(event));
    });

    reader.readAsDataURL(file)

    return fileValue;
  };

}
