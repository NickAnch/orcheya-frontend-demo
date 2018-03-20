import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GantgileModule } from '../gantgile/gantgile.module';
import { UpdaterModule } from '../updater/updater.module';

import { CurrentUserService } from './services/current-user.service';
import { CurrentUserGuard } from './services/current-user.guard';
import { JWTTokenInterceptor } from './services/jwt-token-Interceptor.service';

import { HeaderComponent } from './components/header/header.component';

import { SignInPage } from './pages/sign-in/sign-in.page';
import { WrapperPage } from './pages/wrapper/wrapper.page';
import { EditUserPage } from './pages/edit-user/edit-user.page';
import { UserProfilePage } from './pages/user-profile/user-profile.page';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserActivityComponent } from './components/user-activity/user-activity.component';
import { UserTimelineComponent } from './components/user-timeline/user-timeline.component';
import { UsersListPage } from './pages/users-list/users-list.page';
import { UsersListService } from './services/users-list.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    CoreRoutingModule,
    SharedModule,
    GantgileModule,
    UpdaterModule,
    UpdaterModule,
    InfiniteScrollModule
  ],
  providers: [
    CurrentUserService,
    CurrentUserGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTTokenInterceptor,
      multi: true
    },
    UsersListService
  ],
  declarations: [
    HeaderComponent,
    SignInPage,
    WrapperPage,
    EditUserPage,
    UserProfilePage,
    UserSettingsComponent,
    UserActivityComponent,
    UserTimelineComponent,
    UsersListPage,
  ]
})
export class CoreModule { }
