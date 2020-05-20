import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsRoutingModule } from './comments-routing.module';
import { CommentsComponent } from './comments.component';
import { StreamsModule } from '../streams/streams.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CommentsComponent],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    StreamsModule,
    ReactiveFormsModule
  ]
})
export class CommentsModule { }
