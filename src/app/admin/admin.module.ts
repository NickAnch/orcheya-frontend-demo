import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin.component';
import {
  CanActivateAdminGuard,
  UsersService,
  RolesService
} from './services';

import {
  UsersPage,
  LibsPage
} from './pages';

import {
  UserEditComponent,
  RoleEditComponent,
  RoleDeleteComponent,
  RolesComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    SharedModule,
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
    RolesComponent,
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    LibsPage
  ],
  entryComponents: [
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
  ]
})
export class AdminModule { }
