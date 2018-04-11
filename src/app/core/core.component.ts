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
        { name: 'Test 1', single: true, icon: 'fa-dashboard', link: ['/'] },
        {
          name: 'Test 2',
          single: true,
          icon: 'fa-telegram',
          link: ['/updates']
        },
      ]);
  }
}
