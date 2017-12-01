import { Injectable } from '@angular/core';
import { IMenuGroup } from './menu-group.interface';

@Injectable()
export class SidebarService {
  private _menu: IMenuGroup[] = [];

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
