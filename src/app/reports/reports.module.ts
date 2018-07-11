import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../shared/shared.module';
import {
  ServiceLoadService,
  TimesheetService,
  ServiceLoadDynamicService
} from './services';
import {
  ServiceLoadPage,
  TimesheetPage,
  ServiceLoadDynamicPage
} from './pages';
import {
  SanitizePipe,
  HumanizeTimePipe
} from './pipes';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ChartModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    ServiceLoadService,
    TimesheetService,
    ServiceLoadDynamicService,
    {
      provide: HighchartsStatic,
      useValue: highcharts
    }
  ],
  declarations: [
    ReportsComponent,
    ServiceLoadPage,
    ServiceLoadDynamicPage,
    TimesheetPage,
    SanitizePipe,
    HumanizeTimePipe,
  ]
})
export class ReportsModule { }
