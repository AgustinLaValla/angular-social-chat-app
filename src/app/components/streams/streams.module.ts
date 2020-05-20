import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StreamsRoutingModule } from './streams-routing.module';

import { StreamsComponent } from './streams.component';
import { SideComponent } from '../side/side.component';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostComponent } from '../post/post.component';

@NgModule({
  declarations: [
    StreamsComponent,
    SideComponent,
    PostFormComponent,
    PostComponent,
  ],
  imports: [
    CommonModule,
    StreamsRoutingModule,
    ReactiveFormsModule,
  ],
  exports:[SideComponent]
})
export class StreamsModule { }
