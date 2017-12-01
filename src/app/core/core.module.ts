import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GantgileModule } from '../gantgile/gantgile.module';
import { UpdaterModule } from '../updater/updater.module';

import { CurrentUserService } from './services/current-user.service';
import { CurrentUserGuard } from './services/current-user.guard';

import { HeaderComponent } from './components/header/header.component';

import { LoginPage } from './pages/login/login.page';
import { WrapperPage } from './pages/wrapper/wrapper.page';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    CoreRoutingModule,
    SharedModule,
    GantgileModule,
    UpdaterModule,
    UpdaterModule
  ],
  providers: [
    CurrentUserService,
    CurrentUserGuard
  ],
  declarations: [
    HeaderComponent,
    LoginPage,
    WrapperPage,
  ]
})
export class CoreModule { }
