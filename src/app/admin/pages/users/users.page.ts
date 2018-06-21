import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';

import { UsersService } from '../../services';
import { User } from '../../../core/models/user';
import {
  UserEditComponent
} from '../../components/user-edit/user-edit.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss']
})
export class UsersPage implements OnInit {
  public users: User[];

  constructor(private _usersService: UsersService,
              private _modalService: BsModalService) {}

  ngOnInit() {
    this._usersService
      .getUsersList()
      .subscribe(x => this.users = x);
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
    this._usersService
      .removeUser(user)
      .subscribe(
        () => this.users.splice(this.users.indexOf(user), 1)
      );
  }
}
