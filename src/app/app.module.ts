import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { GantgileModule } from './gantgile/gantgile.module';
import { UpdaterModule } from './updater/updater.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    GantgileModule,
    UpdaterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
