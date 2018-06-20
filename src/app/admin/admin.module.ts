import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {
  CanActivateAdminGuard,
  UsersService,
  RolesService
} from './services';

import {
  UsersPage
} from './pages';
import { RolesPage } from './pages/roles/roles.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ],
  providers: [
    CanActivateAdminGuard,
    UsersService,
    RolesService
  ],
  declarations: [
    AdminComponent,
    UsersPage,
    RolesPage
  ]
})
export class AdminModule { }
