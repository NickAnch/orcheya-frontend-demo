import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { AcceptInvitePage } from './pages/accept-invite/accept-invite.page';
import { UsersListPage } from './pages/users-list/users-list.page';
import { UsersListService } from './services/users-list.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    AcceptInvitePage,
    WrapperPage,
    UsersListPage
  ]
})
export class CoreModule { }
