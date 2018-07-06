import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartModule } from 'angular2-highcharts';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ServiceLoadService } from './services/service-load.service';
import { ServiceLoadPage } from './pages/service-load/service-load.page';
import { TimesheetPage } from './pages/timesheet/timesheet.page';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { SanitizePipe } from './pipes/sanitize.pipe';
import { HumanizeTimePipe } from './pipes/humanizeTime.pipe';
import { TimesheetService } from './services/timesheet.service';


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
    TimesheetService
  ],
  declarations: [
    ReportsComponent,
    ServiceLoadPage,
    TimesheetPage,
    SanitizePipe,
    HumanizeTimePipe,
  ]
})
export class ReportsModule { }
