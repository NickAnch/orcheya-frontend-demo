import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { GantgileModule } from '../gantgile/gantgile.module';
import { UpdaterModule } from '../updater/updater.module';
import { HttpClientModule } from '@angular/common/http';

import { CoreRoutingModule } from './core-routing.module';
import { LoginPage } from './pages/login/login.page';
import { HeaderComponent } from './components/header/header.component';
import { WrapperPage } from './pages/wrapper/wrapper.page';

import { CurrentUserService } from './services/current-user.service';
import { CurrentUserGuard } from './services/current-user.guard';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    GantgileModule,
    UpdaterModule,
    HttpClientModule,
    BsDropdownModule.forRoot()
  ],
  providers: [
    CurrentUserService,
    CurrentUserGuard
  ],
  declarations: [
    LoginPage,
    HeaderComponent,
    WrapperPage
  ]
})
export class CoreModule { }
