import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ServiceLoadPage } from './pages/service-load/service-load.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'service-load', component: ServiceLoadPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
