import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

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
  UpworkTrackingPage,
} from './pages';

import {
  UserEditComponent,
  RoleEditComponent,
  RoleDeleteComponent,
  RolesComponent,
  TimingsComponent,
  TimingDeleteComponent,
  ProjectsComponent,
  UserDeleteComponent
} from './components';

import {
  UpworkTrackingEditComponent,
  ConfirmModalWorklogComponent
} from './modals';

import { HumanizeDatePipe } from '../core/pipes/humanizeDate.pipe';
import { MapComponent } from '../core/components';
import { WorklogsControlService } from './services/upwork-tracking.service';
import { TagsComponent } from './components/tags/tags.component';
import { TagsService } from './services/tags.service';
import { TagEditComponent } from './components/tag-edit/tag-edit.component';
import {
  TagDeleteComponent
} from './components/tag-delete/tag-delete.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),
    TypeaheadModule.forRoot(),
    SharedModule,
    AdminRoutingModule
  ],
  providers: [
    CanActivateAdminGuard,
    UsersService,
    RolesService,
    TimingsService,
    WorklogsControlService,
    TagsService
  ],
  declarations: [
    AdminComponent,
    UsersPage,
    RolesComponent,
    TimingsComponent,
    TimingDeleteComponent,
    ProjectsComponent,
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    TimingsComponent,
    LibsPage,
    UpworkTrackingPage,
    UserDeleteComponent,
    HumanizeDatePipe,
    MapComponent,
    UpworkTrackingEditComponent,
    ConfirmModalWorklogComponent,
    TagsComponent,
    TagEditComponent,
    TagDeleteComponent,
  ],
  entryComponents: [
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    TimingDeleteComponent,
    UserDeleteComponent,
    UpworkTrackingEditComponent,
    ConfirmModalWorklogComponent,
    TagEditComponent,
    TagDeleteComponent
  ]
})
export class AdminModule { }
