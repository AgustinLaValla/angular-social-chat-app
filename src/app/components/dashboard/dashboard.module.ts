import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SpecialCharacterPipe } from 'src/app/pipes/special-character.pipe';


@NgModule({
  declarations: [DashboardComponent, ToolbarComponent, SpecialCharacterPipe],
  imports: [
    CommonModule,
    DashboardRoutingModule,
  ]
})
export class DashboardModule { }
