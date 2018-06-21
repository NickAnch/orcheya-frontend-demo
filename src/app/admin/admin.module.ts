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
import { RolesPage } from './pages/roles/roles.page';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { SharedModule } from '../shared/shared.module';
import { RoleEditComponent } from './components/role-edit/role-edit.component';


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
    RoleEditComponent
  ],
  entryComponents: [
    UserEditComponent,
    RoleEditComponent
  ]
})
export class AdminModule { }
