import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { CanActivateAdminGuard } from './services';
import {
  UsersPage,
  LibsPage,
  UpworkTrackingPage,
  InventoriesPage
} from './pages';
import { MapComponent } from '../core/components';
import { InventoryAccessGuard } from './services/inventory-access.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [CanActivateAdminGuard],
    children: [
      { path: 'users', component: UsersPage },
      { path: 'libs', component: LibsPage },
      { path: 'upwork-tracking', component: UpworkTrackingPage },
      { path: 'map', component: MapComponent },
      { path: 'inventories',
        component: InventoriesPage,
        canActivate: [InventoryAccessGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
