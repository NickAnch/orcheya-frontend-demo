import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../shared/sidebar';

@Component({
  selector: 'app-reports',
  template: `<router-outlet></router-outlet>`
})
export class ReportsComponent implements OnInit {
  constructor(private sideBarService: SidebarService) {
  }

  ngOnInit() {
  }
}
