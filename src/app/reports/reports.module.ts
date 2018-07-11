import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular2-highcharts';

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
    ChartModule.forRoot(require('highcharts')),
    FormsModule,
    SharedModule
  ],
  providers: [
    ServiceLoadService,
    TimesheetService,
    ServiceLoadDynamicService
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
