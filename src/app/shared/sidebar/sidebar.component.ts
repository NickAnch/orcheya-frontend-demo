import { Component } from '@angular/core';
import { IMenuGroup } from './menu-group.interface';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent {
  public currentGroup: IMenuGroup;

  constructor(public sidebarService: SidebarService) {
  }

  public menuGroups: IMenuGroup[] = [
    {
      name: 'Test 1',
      icon: 'fa-dashboard',
      single: false,
      items: [
        { name: 'test 1', link: ['test1'] },
        { name: 'test 2', link: ['test2'] },
        { name: 'test 3', link: ['test3'] },
        { name: 'test 4', link: ['test4'] },
      ]
    },
    {
      name: 'Test 2',
      icon: 'fa-telegram',
      single: false,
      items: [
        { name: 'test 1', link: ['test1'] },
        { name: 'test 2', link: ['test2'] },
        { name: 'test 3', link: ['test3'] },
        { name: 'test 4', link: ['test4'] },
      ]
    },
    {
      name: 'Test 3',
      icon: 'fa-users',
      single: false,
      items: [
        { name: 'test 1', link: ['test1'] },
        { name: 'test 2', link: ['test2'] },
        { name: 'test 3', link: ['test3'] },
        { name: 'test 4', link: ['test4'] },
      ]
    }
  ];
}
