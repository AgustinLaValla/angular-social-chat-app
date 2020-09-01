import { Component, OnInit, OnDestroy } from '@angular/core';
import { URL } from '../../../config/url.config';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import * as M from 'materialize-css';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit, OnDestroy {

  public user: any;
  public userData;
  private url = `${URL}/upload-image`;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });
  private selectedFile: any;
  public images = [];

  private imageRefresherObs$ = new Subscription();

  private loadingObs$ = new Subscription();
  public isLoading: boolean = false;

  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private socketService: SocketService,
    private uiService: UiService
  ) {
    this.loadingObs$ = this.uiService.loadingSubjet.subscribe(isLoading => this.isLoading = isLoading);
  };

  ngOnInit(): void {
    this.user = this.tokenService.getTokenPayload().user;
    this.getUser();
    this.imageRefreshListener();
  };

  getUser() {
    this.usersService.getUserById(this.user._id).subscribe((resp) => {
      this.images = resp.images;
      this.userData = resp;
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


  upload() {
    this.uiService.loadingSubjet.next(true);
    this.usersService.addImage(this.selectedFile).subscribe((resp) => {
      const filePath = <HTMLInputElement>document.getElementById('filePath');
      filePath.value = '';
      this.socketService.emit('refresh-images');
      this.uiService.loadingSubjet.next(false);
    },
      error => console.log(error));
  };

  imageRefreshListener() {
    this.imageRefresherObs$ = this.socketService.listen('refresh-images').subscribe(() => this.getUser());
  };

  setAsProfileImage(image) {
    this.usersService.udpateProfilePic(image).subscribe(() => {
      this.socketService.emit('profile-pic-updated');
      this.getUser();
  });
  };


  deleteImage(image) {
    
    this.uiService.loadingSubjet.next(true);
    this.usersService.deleteImage(image).subscribe(() => {
      this.socketService.emit('refresh-images');
      this.uiService.loadingSubjet.next(false);
      console.log(image.imgId, this.userData)
      if(image.imgId === this.userData.picId) this.socketService.emit('profile-pic-updated');
    });
  };

  ngOnDestroy(): void {
    this.loadingObs$.unsubscribe();
    this.imageRefresherObs$.unsubscribe();
  };

};
