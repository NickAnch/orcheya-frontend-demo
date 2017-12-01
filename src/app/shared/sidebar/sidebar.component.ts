import { Component } from '@angular/core';
import { IMenuGroup } from './menu-group.interface';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public currentGroup: IMenuGroup;

  constructor(public sidebarService: SidebarService) {
  }

  public toggleGroup(group: IMenuGroup): void {
    this.currentGroup = group === this.currentGroup ? null : group;
  }
}
