import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GantgileModule } from '../gantgile/gantgile.module';
import { UpdaterModule } from '../updater/updater.module';

import { CurrentUserService } from './services/current-user.service';
import { CurrentUserGuard } from './services/current-user.guard';
import { JWTTokenInterceptor } from './services/jwt-token-Interceptor.service';
import { TimeDoctorResolver } from './services/time-doctor.resolver';

import { SignInPage } from './pages/sign-in/sign-in.page';
import { CoreComponent } from './core.component';
import { UserProfilePage } from './pages/user-profile/user-profile.page';

import {
  UserSettingsComponent,
  UserActivityComponent,
  UserTimelineComponent,
  HeaderComponent,
  SlackConnectButtonComponent,
  TimeDoctorConnectButtonComponent,
  TimeActivityComponent,
  UserSettingFormComponent,
  TimeTableComponent,
  UpdatesComponent,
  RecentUpdateComponent,
} from './components';

import { ImageUploadDirective } from './directives/image-upload.directive';

import { AcceptInvitePage } from './pages/accept-invite/accept-invite.page';
import { UsersListPage } from './pages/users-list/users-list.page';
import { UsersListService } from './services/users-list.service';
import { SlackConnectorService } from './services/slack-connector.service';
import {
  TimeDoctorConnectorService
} from './services/timedoctor-connector.service';
import { HumanizeTimePipe } from './pipes/humanizeTime.pipe';
import {
  TermsAndConditionsComponent
} from './pages/terms-and-conditions/terms-and-conditions.component';

import {
  RegistrationComponent
} from './pages/registration/registration.component';
import { RegistrationGuard } from './services/registration.guard';
import { PermissionGuard } from './services/permission.guard';
import { UpdateService } from './services/update.service';
import { UpdatesPage } from './pages/updates/updates.page';
import { FooterComponent } from './components/footer/footer.component';
import { TreeviewModule } from 'ngx-treeview';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CoreRoutingModule,
    SharedModule,
    GantgileModule,
    UpdaterModule,
    UpdaterModule,
    InfiniteScrollModule,
    TreeviewModule.forRoot(),
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
    SlackConnectorService,
    TimeDoctorConnectorService,
    TimeDoctorResolver,
    UpdateService,
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
    SlackConnectButtonComponent,
    ImageUploadDirective,
    TimeDoctorConnectButtonComponent,
    TimeActivityComponent,
    HumanizeTimePipe,
    TimeTableComponent,
    TermsAndConditionsComponent,
    RecentUpdateComponent,
    RegistrationComponent,
    UpdatesComponent,
    UpdatesPage,
    UserSettingFormComponent,
    FooterComponent
  ]
})
export class CoreModule { }
