import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { GantgileModule } from '../gantgile/gantgile.module';
import { UpdaterModule } from '../updater/updater.module';

import { CoreRoutingModule } from './core-routing.module';
import { LoginPage } from './pages/login/login.page';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    GantgileModule,
    UpdaterModule
  ],
  declarations: [LoginPage, HeaderComponent]
})
export class CoreModule { }
