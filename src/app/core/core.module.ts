import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GantgileModule } from '../gantgile/gantgile.module';
import { UpdaterModule } from '../updater/updater.module';
import { ReportsModule } from '../reports/reports.module';

import { CurrentUserService } from './services/current-user.service';
import { CurrentUserGuard } from './services/current-user.guard';
import { JWTTokenInterceptor } from './services/jwt-token-Interceptor.service';

import { CoreComponent } from './core.component';
import { RolesService } from './services/roles.service';
import {
  UserSettingsComponent,
  UserActivityComponent,
  UserTimelineComponent,
  HeaderComponent,
  SlackButtonComponent,
  TimedoctorButtonComponent,
  TimeActivityComponent,
  UserSettingFormComponent,
  TimeTableComponent,
  UpdatesComponent,
  RecentUpdateComponent,
  WaitingComponent,
  UpworkButtonComponent,
  FooterComponent,
} from './components';

import { ImageUploadDirective } from './directives/image-upload.directive';

import { UsersListService } from './services/users-list.service';
import { HumanizeTimePipe } from './pipes/humanizeTime.pipe';

import { RegistrationGuard } from './services/registration.guard';
import { PermissionGuard } from './services/permission.guard';
import { UpdateService } from './services/update.service';
import { IntegrationsService } from './services/integrations.service';
import { ProjectService } from './services/project.service';
import { AdminModule } from '../admin/admin.module';
import { TimingsService } from './services/timings.service';
import {
  NotificationsComponent
} from './components/notifications/notifications.component';
import { NotificationsService } from './services/notifications.service';
import {
  AcceptInvitePage,
  IntegrationsPage,
  RegistrationPage,
  SignInPage,
  TermsAndConditionsPage,
  UpdatesPage,
  UserProfilePage,
  UsersListPage
} from './pages';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreRoutingModule,
    SharedModule,
    AdminModule,
    GantgileModule,
    UpdaterModule,
    ReportsModule
  ],
  providers: [
    CurrentUserService,
    CurrentUserGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTTokenInterceptor,
      multi: true
    },
    RegistrationGuard,
    PermissionGuard,
    UsersListService,
    IntegrationsService,
    UpdateService,
    ProjectService,
    RolesService,
    TimingsService,
    NotificationsService,
  ],
  declarations: [
    HeaderComponent,
    SignInPage,
    AcceptInvitePage,
    CoreComponent,
    UserProfilePage,
    UserSettingsComponent,
    UserActivityComponent,
    UserTimelineComponent,
    UsersListPage,
    SlackButtonComponent,
    ImageUploadDirective,
    TimedoctorButtonComponent,
    UpworkButtonComponent,
    TimeActivityComponent,
    HumanizeTimePipe,
    TimeTableComponent,
    TermsAndConditionsPage,
    RecentUpdateComponent,
    RegistrationPage,
    UpdatesComponent,
    UpdatesPage,
    UserSettingFormComponent,
    FooterComponent,
    WaitingComponent,
    IntegrationsPage,
    NotificationsComponent,
  ],
  entryComponents: [
    WaitingComponent,
  ]
})
export class CoreModule {}
