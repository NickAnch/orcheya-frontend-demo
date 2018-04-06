import { Injectable } from '@angular/core';
import { IMenuGroup } from './menu-group.interface';

@Injectable()
export class SidebarService {
  private _menu: IMenuGroup[] = [];

  constructor() {
    this._menu = [
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

  public get menu(): IMenuGroup[] {
    return this._menu;
  }

  public add(group: IMenuGroup[] | IMenuGroup): void {
    if (Array.isArray(group)) {
      this._menu = this._menu.concat(group);
    } else {
      this._menu.push(group);
    }
  }
}
