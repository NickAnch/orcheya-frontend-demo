import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../shared/sidebar';
import { CurrentUserService } from './services/current-user.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './core.component.html',
  styleUrls: ['core.component.scss']
})
export class CoreComponent implements OnInit {

  constructor(private sideBarService: SidebarService,
              private _currentUser: CurrentUserService) {
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
        {
          name: 'Reports',
          single: false,
          icon: 'fa-file-text',
          items: [
            { name: 'Service load', link: ['/reports/service-load'] },
            { name: 'Timesheet', link: ['/reports/timesheet'] },
            {
              name: 'Users and Projects',
              link: ['/reports/users-and-projects']
            }
          ]
        }
      ]);

    if (this._currentUser.role.isAdmin) {
      const itemsForAdmin = [
        { name: 'Users', link: ['/admin', 'users'] },
        { name: 'Libs', link: ['/admin', 'libs'] },
        { name: 'Upwork tracking', link: ['/admin', 'upwork-tracking'] },
        { name: 'Map', link: ['/admin', 'map'] }
      ];

      if (this._currentUser.role.isInventoryNotify) {
        itemsForAdmin.push({ name: 'Inventories',
                             link: ['/admin', 'inventories'] });
      }
      this.sideBarService
        .add(
          {
            name: 'Administrate',
            icon: 'fa-wheelchair',
            single: false,
            items: itemsForAdmin
          }
        );
    }
  }
}
