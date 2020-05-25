import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StreamsRoutingModule } from './streams-routing.module';

import { StreamsComponent } from './streams.component';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostComponent } from '../post/post.component';
import { TopStreamsComponent } from '../top-streams/top-streams.component';

@NgModule({
  declarations: [
    StreamsComponent,
    PostFormComponent,
    PostComponent,
    TopStreamsComponent,
  ],
  imports: [
    CommonModule,
    StreamsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class StreamsModule { }
