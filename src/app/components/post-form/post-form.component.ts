import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { SocketService } from 'src/app/services/socket.service';
import { FileUploader } from 'ng2-file-upload';
import { URL } from '../../../config/url.config';
import { tap } from 'rxjs/operators';
import { UiService } from 'src/app/services/ui.service';


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

  public selectedFile: any;

  @ViewChild('imageDescription') imageDescription: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(
    private postService: PostsService,
    private fb: FormBuilder,
    private socketService: SocketService,
    private uiService: UiService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.initForm();
  };


  initForm() {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    });
  };

  submitPost() {
    if (!this.postForm.value.post.length && !this.selectedFile) return;

    this.uiService.loadingSubjet.next(true);
    this.postService.postLimit += 1;

    let body;

    if (!this.selectedFile!) {
      body = { ...this.postForm.value };
    };
    if (this.selectedFile) {
      body = { ...this.postForm.value, image: this.selectedFile }
    };
    
    this.postService.addPost(body).pipe(
      tap({
        next: () => {
          this.uiService.loadingSubjet.next(false);
          this.socketService.emit('refresh-posts', { newPostAdded: true });
          this.postForm.reset();
          this.fileInput.nativeElement.value = '';
          this.imageDescription.nativeElement.value = '';
          this.selectedFile = null;
        }
      })
    ).subscribe();

  };

  async onFileSelected(event: FileList) {
    if (event[0].type.indexOf('image') < 0) {
      this.uiService.toastMessage('Only jpg, png, jpeg and gif are accepted');
      this.fileInput.nativeElement.value = '';
      this.renderer.setValue(this.imageDescription.nativeElement, '');
      
      return;
    };
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
