import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

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
import { RolesPage } from './pages';
import {
  UserEditComponent,
  RoleEditComponent,
  RoleDeleteComponent
} from './components';
import { SharedModule } from '../shared/shared.module';


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
    RolesPage,
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
  ],
  entryComponents: [
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
  ]
})
export class AdminModule { }
