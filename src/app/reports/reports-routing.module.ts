import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ServiceLoadPage } from './pages/service-load/service-load.page';
import { TimesheetPage } from './pages/timesheet/timesheet.page';
import {
  UsersAndProjectsPage
} from './pages/users-and-projects/users-and-projects.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'service-load', component: ServiceLoadPage },
      { path: 'timesheet', component: TimesheetPage },
      { path: 'users-and-projects', component: UsersAndProjectsPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
