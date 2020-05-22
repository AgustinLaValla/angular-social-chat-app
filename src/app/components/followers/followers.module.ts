import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowersRoutingModule } from './followers-routing.module';
import { FollowersComponent } from './followers.component';


@NgModule({
  declarations: [FollowersComponent],
  imports: [
    CommonModule,
    FollowersRoutingModule
  ]
})
export class FollowersModule { }
