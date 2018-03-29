import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarComponent, SidebarService } from './sidebar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    SidebarService,
  ],
  declarations: [
    SidebarComponent,
  ],
  exports: [
    SidebarComponent,
  ]
})
export class SharedModule { }
