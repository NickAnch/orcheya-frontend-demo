import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ServiceLoadService } from './services/service-load.service';
import { ServiceLoadPage } from './pages/service-load/service-load.page';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { SanitizePipe } from './pipes/sanitize.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    ServiceLoadService
  ],
  declarations: [
    ReportsComponent,
    ServiceLoadPage,
    SanitizePipe
  ]
})
export class ReportsModule { }
