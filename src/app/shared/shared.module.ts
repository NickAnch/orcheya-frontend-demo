import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { SidebarComponent, SidebarService } from './sidebar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { InViewportModule } from 'ng-in-viewport';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    InViewportModule.forRoot(),
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
    BsDropdownModule,
    TabsModule,
    BsDatepickerModule,
    NgSelectModule,
    InViewportModule,
    ModalModule,
    ProgressbarModule,
  ]
})
export class SharedModule { }
