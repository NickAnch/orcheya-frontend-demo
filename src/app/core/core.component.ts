import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../shared/sidebar/sidebar.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './core.component.html',
  styleUrls: []
})
export class CoreComponent implements OnInit {

  constructor(private sideBarService: SidebarService) {}

  ngOnInit() {
    this.sideBarService
      .add([
        { single: true, icon: 'fa-dashboard', link: ['/'] },
        { single: true, icon: 'fa-telegram', link: ['/updates'] },
      ]);
  }
}
