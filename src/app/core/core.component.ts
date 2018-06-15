import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../shared/sidebar';

@Component({
  selector: 'app-wrapper',
  templateUrl: './core.component.html',
  styleUrls: []
})
export class CoreComponent implements OnInit {

  constructor(private sideBarService: SidebarService) {
  }

  ngOnInit() {
    this.sideBarService
      .add([
        { name: 'Dashboard', single: true, icon: 'fa-dashboard', link: ['/'] },
        {
          name: 'Updates',
          single: true,
          icon: 'fa-telegram',
          link: ['/updates']
        },
        {
          name: 'Reports',
          single: false,
          icon: 'fa-file-text',
          items: [
            { name: 'Service load', link: ['/reports/service-load'] }
          ]
        }
      ]);
  }
}
