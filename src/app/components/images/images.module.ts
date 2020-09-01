import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagesRoutingModule } from './images-routing.module';
import { ImagesComponent } from './images.component';

import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [ImagesComponent],
  imports: [
    CommonModule,
    ImagesRoutingModule,
    FileUploadModule
  ]
})
export class ImagesModule { }
