import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ServiceLoadPage } from './pages/service-load/service-load.page';
// import { CanActivateAdminGuard } from './services';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    // canActivate: [CanActivateAdminGuard],
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
