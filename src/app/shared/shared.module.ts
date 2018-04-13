import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { SidebarComponent, SidebarService } from './sidebar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  providers: [
    SidebarService,
  ],
  declarations: [
    SidebarComponent,
  ],
  exports: [
    SidebarComponent,
    ModalModule,
    ProgressbarModule,
  ]
})
export class SharedModule { }
