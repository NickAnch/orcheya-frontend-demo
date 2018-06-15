import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {
  CanActivateAdminGuard,
  UsersService
} from './services';

import {
  UsersPage
} from './pages';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ],
  providers: [
    CanActivateAdminGuard,
    UsersService
  ],
  declarations: [
    AdminComponent,
    UsersPage
  ]
})
export class AdminModule { }
