import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin.component';
import {
  CanActivateAdminGuard,
  UsersService,
  RolesService,
  TimingsService
} from './services';

import {
  UsersPage,
  LibsPage,
  ProjectsPage
} from './pages';

import {
  UserEditComponent,
  RoleEditComponent,
  RoleDeleteComponent,
  RolesComponent,
  TimingsComponent,
  TimingDeleteComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    SharedModule,
    AdminRoutingModule
  ],
  providers: [
    CanActivateAdminGuard,
    UsersService,
    RolesService,
    TimingsService
  ],
  declarations: [
    AdminComponent,
    UsersPage,
    RolesComponent,
    TimingsComponent,
    TimingDeleteComponent,
    ProjectsPage,
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    TimingsComponent,
    LibsPage
  ],
  entryComponents: [
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    TimingDeleteComponent
  ]
})
export class AdminModule { }
