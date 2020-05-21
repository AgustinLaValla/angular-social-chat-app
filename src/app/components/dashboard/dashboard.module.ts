import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SpecialCharacterPipe } from 'src/app/pipes/special-character.pipe';
import { SideComponent } from '../side/side.component';


@NgModule({
  declarations: [DashboardComponent, ToolbarComponent, SpecialCharacterPipe, SideComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
  ]
})
export class DashboardModule { }
