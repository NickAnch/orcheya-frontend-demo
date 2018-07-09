import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';

import { UsersService } from '../../services';
import { User } from '../../../core/models/user';
import { Role } from '../../../core/models/role';
import {
  UserEditComponent,
  UserDeleteComponent
} from '../../components';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss']
})
export class UsersPage implements OnInit {
  public users: User[];
  public deletedUsers: User[];
  public roles: Role[];

  constructor(private _usersService: UsersService,
              private _modalService: BsModalService) {}

  ngOnInit() {
    this._usersService
      .getUsersList()
      .subscribe(x => {
        this.users = x.users;
        this.roles = x.roles;
        this.deletedUsers = x.deletedUsers;
      });
  }

  public editUser(user: User): void {
    const initialState = {
      userId: user.id
    };

    const modal = this._modalService.show(UserEditComponent, { initialState });
    modal.content
      .onUserUpdate
      .subscribe(x => {
        user._fromJSON(x._toJSON());
        modal.hide();
      });
  }

  public removeUser(user: User): void {
    const initialState = {
      user: user
    };

    const modal = this._modalService
      .show(UserDeleteComponent, { initialState });
    modal.content
      .onUserDelete
      .subscribe(() => {
        this.users.splice(this.users.indexOf(user), 1);
        modal.hide();
      });
  }

  public invite(email: string, roleId: number): void {
    if (email && roleId) {
      this._usersService
        .invite(email, roleId)
        .subscribe(
          () => this.ngOnInit(),
          x => console.log(x));
    }
  }
}
