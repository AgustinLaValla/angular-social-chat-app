import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthTabsRoutingModule } from './auth-tabs-routing.module';
import { AuthTabsComponent } from './auth-tabs.component';

import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';


@NgModule({
  declarations: [AuthTabsComponent, SignupComponent, LoginComponent],
  imports: [
    CommonModule,
    AuthTabsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AuthTabsModule { }
