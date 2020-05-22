import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowingRoutingModule } from './following-routing.module';
import { FollowingComponent } from './following.component';


@NgModule({
  declarations: [FollowingComponent],
  imports: [
    CommonModule,
    FollowingRoutingModule
  ]
})
export class FollowingModule { }
