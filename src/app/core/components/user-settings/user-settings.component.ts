import { Component, OnInit } from '@angular/core';

import { CurrentUserService } from '../../services/current-user.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  public isSlackOpen = false;


  constructor(public currentUser: CurrentUserService) {}

  ngOnInit() {

  }

  public onSlackSettings() {
    this.isSlackOpen = !this.isSlackOpen;
  }

  public onSlackChange(notifyUpdate) {
    const updateUser = new User();
    updateUser.notifyUpdate = notifyUpdate;

    this.currentUser
      .updateSettings(updateUser)
      .subscribe();
  }
}
