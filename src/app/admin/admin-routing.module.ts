import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { CanActivateAdminGuard } from './services';
import { UsersPage, RolesPage } from './pages';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [CanActivateAdminGuard],
    children: [
      { path: 'users', component: UsersPage },
      { path: 'roles', component: RolesPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
