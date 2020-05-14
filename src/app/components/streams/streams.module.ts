import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StreamsRoutingModule } from './streams-routing.module';

import { StreamsComponent } from './streams.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { SideComponent } from '../side/side.component';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostComponent } from '../post/post.component';

@NgModule({
  declarations: [StreamsComponent, ToolbarComponent, SideComponent, PostFormComponent, PostComponent],
  imports: [
    CommonModule,
    StreamsRoutingModule,
    ReactiveFormsModule
  ]
})
export class StreamsModule { }
