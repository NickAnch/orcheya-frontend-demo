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
        { name: 'Members List', single: true, icon: 'fa-users', link: ['/'] },
        {
          name: 'Updates',
          single: true,
          icon: 'fa-telegram',
          link: ['/updates']
        },
      ]);

    this.sideBarService
      .add(
        {
          name: 'Administrate',
          icon: 'fa-wheelchair',
          single: false,
          items: [
            { name: 'Users', link: ['/admin', 'users'] },
          ]
        }
      );
  }
}
