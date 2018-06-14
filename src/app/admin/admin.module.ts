import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CanActivateAdminGuard } from './services';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  providers: [CanActivateAdminGuard],
  declarations: [AdminComponent]
})
export class AdminModule { }
