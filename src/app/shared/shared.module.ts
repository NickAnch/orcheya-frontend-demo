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
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { InViewportModule } from 'ng-in-viewport';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ButtonsModule } from 'ngx-bootstrap';
import { InputMaskDirective } from './input-mask/input-mask.directive';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    UiSwitchModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    InViewportModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
  ],
  providers: [
    SidebarService,
  ],
  declarations: [
    SidebarComponent,
    InputMaskDirective,
    FilterPipe
  ],
  exports: [
    SidebarComponent,
    InputMaskDirective,
    BsDropdownModule,
    TabsModule,
    BsDatepickerModule,
    NgSelectModule,
    InViewportModule,
    ModalModule,
    ProgressbarModule,
    AccordionModule,
    UiSwitchModule,
    ButtonsModule,
    FilterPipe
  ]
})
export class SharedModule { }
