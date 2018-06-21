import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {
  CanActivateAdminGuard,
  UsersService
} from './services';

import {
  UsersPage
} from './pages';
import { UserEditComponent } from './components/user-edit/user-edit.component';
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
    UsersService
  ],
  declarations: [
    AdminComponent,
    UsersPage,
    UserEditComponent
  ],
  entryComponents: [
    UserEditComponent
  ]
})
export class AdminModule { }
