import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {
  CanActivateAdminGuard
} from './services';

import {
  UsersPage
} from './pages';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  providers: [
    CanActivateAdminGuard
  ],
  declarations: [
    AdminComponent,
    UsersPage
  ]
})
export class AdminModule { }
