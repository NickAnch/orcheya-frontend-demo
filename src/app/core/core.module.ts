import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GantgileModule } from '../gantgile/gantgile.module';
import { UpdaterModule } from '../updater/updater.module';

import { CurrentUserService } from './services/current-user.service';
import { CurrentUserGuard } from './services/current-user.guard';
import { JWTTokenInterceptor } from './services/jwt-token-Interceptor.service';

import { SignInPage } from './pages/sign-in/sign-in.page';
import { WrapperPage } from './pages/wrapper/wrapper.page';
import { UserProfilePage } from './pages/user-profile/user-profile.page';

import {
  UserSettingsComponent,
  UserActivityComponent,
  UserTimelineComponent,
  HeaderComponent,
  SlackConnectButtonComponent,
  TimeDoctorConnectButtonComponent,
  TimeActivityComponent,
  TimeThisWeekComponent,
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
  RecentUpdateComponent
} from './components/recent-update/recent-update.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    CoreRoutingModule,
    SharedModule,
    GantgileModule,
    UpdaterModule,
    UpdaterModule,
    InfiniteScrollModule,
  ],
  providers: [
    CurrentUserService,
    CurrentUserGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTTokenInterceptor,
      multi: true
    },
    UsersListService,
    SlackConnectorService,
    TimeDoctorConnectorService,
  ],
  declarations: [
    HeaderComponent,
    SignInPage,
    AcceptInvitePage,
    WrapperPage,
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
    TimeThisWeekComponent,
    TermsAndConditionsComponent,
    RecentUpdateComponent
  ]
})
export class CoreModule { }
