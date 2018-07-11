import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ServiceLoadPage } from './pages/service-load/service-load.page';
import { TimesheetPage } from './pages/timesheet/timesheet.page';
import {
  ServiceLoadDynamicPage
} from './pages/service-load-dynamic/service-load-dynamic.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'service-load', component: ServiceLoadPage },
      { path: 'timesheet', component: TimesheetPage },
      { path: 'service-load-dynamic', component: ServiceLoadDynamicPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
