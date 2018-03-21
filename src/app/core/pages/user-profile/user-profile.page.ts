import { Component, OnInit } from '@angular/core';

import { CurrentUserService } from '../../services/current-user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit {

  public currentSheet = 'activity';
  public currentUser: User;

  constructor(private _currentUserService: CurrentUserService) {}

  ngOnInit() {
    this._currentUserService
      .load()
      .subscribe((user: User) => this.currentUser = user)
    ;
  }

  public selectSheet(sheet: string) {
    this.currentSheet = sheet;
  }

  public onUserUpdate(user: User) {
    this.currentUser = user;
  }
}

