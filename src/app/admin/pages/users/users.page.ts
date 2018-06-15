import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss']
})
export class UsersPage implements OnInit {
  public users: User[];

  constructor(private _usersService: UsersService) {}

  ngOnInit() {
    this._usersService
      .getUsersList()
      .subscribe(x => this.users = x);
  }
}
