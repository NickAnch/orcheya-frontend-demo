import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarComponent, SidebarService } from './sidebar';
import { TimeActivityComponent } from './time-activity/time-activity.component';

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
    TimeActivityComponent,
  ],
  exports: [
    SidebarComponent,
    TimeActivityComponent,
  ]
})
export class SharedModule { }
