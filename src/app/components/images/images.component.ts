import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { URL } from '../../../config/url.config';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit, OnDestroy {

  public user: any;
  public userData;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });
  private selectedFile: any;
  public images = [];

  private imageRefresherObs$ = new Subscription();

  private loadingObs$ = new Subscription();
  public isLoading: boolean = false;

  @ViewChild('filePath') filePath: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private socketService: SocketService,
    private uiService: UiService,
    private renderer: Renderer2
  ) {
    this.loadingObs$ = this.uiService.loadingSubjet.subscribe({
      next: isLoading => this.isLoading = isLoading
    });
  };

  ngOnInit(): void {
    this.user = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.imageRefreshListener();
  };

  getUser() {
    this.usersService.getUserById(this.user._id).pipe(
      map(({user}) => {
        console.log(user);
        this.images = user.images;
        this.userData = user;
      })
    ).subscribe();
  };

  async onFileSelected(event: FileList) {
    if (event[0].type.indexOf('image') < 0) {
      this.uiService.toastMessage('Only jpg, png, jpeg and gif are accepted');
      this.fileInput.nativeElement.value = '';
      return;
    }
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


  upload() {
    this.uiService.loadingSubjet.next(true);
    this.usersService.addImage(this.selectedFile).pipe(
      tap({
        next: () => {
          this.renderer.setValue(this.filePath.nativeElement, '');
          this.socketService.emit('refresh-images');
          this.uiService.loadingSubjet.next(false);
        }
      })
    ).subscribe({
      error: error => console.log(error)
    });
  };

  imageRefreshListener() {
    this.imageRefresherObs$ = this.socketService.listen('refresh-images').subscribe({
      next: () => this.getUser()
    });
  };

  setAsProfileImage(image) {
    this.uiService.loadingSubjet.next(true);
    this.usersService.udpateProfilePic(image).pipe(
      tap(() => {
        this.uiService.loadingSubjet.next(false);
        this.socketService.emit('profile-pic-updated');
        this.getUser();
      })
    ).subscribe();
  };


  deleteImage(image) {

    this.uiService.loadingSubjet.next(true);
    this.usersService.deleteImage(image).pipe(
      tap(() => {
        this.socketService.emit('refresh-images');
        this.uiService.loadingSubjet.next(false);
        if (image.imgId === this.userData.picId) {
          this.socketService.emit('profile-pic-updated')
        };
      })
    ).subscribe();
  };

  ngOnDestroy(): void {
    this.loadingObs$.unsubscribe();
    this.imageRefresherObs$.unsubscribe();
  };

};
