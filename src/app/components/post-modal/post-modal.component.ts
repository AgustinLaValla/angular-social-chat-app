import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostModalService } from './post-modal.service';
import { PostsService } from 'src/app/services/posts.service';
import { SocketService } from 'src/app/services/socket.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css']
})
export class PostModalComponent implements OnInit {

  public editForm: FormGroup;

  public modal:HTMLElement;

  constructor(
    private fb: FormBuilder, 
    public postModalService:PostModalService,
    private postsService:PostsService,
    private socketService:SocketService) { }

  ngOnInit(): void {
    
    this.modal = document.querySelector('.modal');
    new M.Modal(this.modal);
    
    this.initPostForm();
    this.openModalListener();
  };

  initPostForm() {
    this.editForm = this.fb.group({ editedPost: ['', Validators.required] });
  };

  openModal() { 
    this.editForm.controls.editedPost.reset(this.postModalService.postValue.post);
  };

  deletePost() { 
    this.postsService.deletePost(this.postModalService.postValue._id).subscribe(() => {
      this.socketService.emit('refresh-posts', {});
      this.closeModal();
    });
  };

  submitEditedPost() { 
    if(this.editForm.controls.editedPost.value == '' || isNullOrUndefined(this.editForm.controls.editedPost.value)) {
      this.postModalService.open.emit(false);
      return;
    };
    const body = { id: this.postModalService.postValue._id, post: this.editForm.controls.editedPost.value };
    this.postsService.editPost(body).subscribe(() => {
      this.socketService.emit('refresh-posts', {});
      this.postModalService.open.emit(false);
    });
  };

  closeModal() { 
    M.Modal.getInstance(this.modal).close();
    this.editForm.controls.editedPost.reset('');
    this.postModalService.postValue = null;
  };

  openModalListener() {
    this.postModalService.open.subscribe((isOpen:boolean) => {
      if(isOpen) { 
        this.openModal();
      } else { 
        this.closeModal();
      };
    });
  };

  
  closePickerHandler() {
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 27) {
        this.postModalService.open.emit(false);
      };
    });
  };

};
