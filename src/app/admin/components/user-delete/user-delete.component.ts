import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

import { User } from '../../../core/models/user';
import { UsersService } from '../../services';
import {
  CurrentUserService
} from '../../../core/services/current-user.service';

@Component({
  selector: 'app-role-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})

export class UserDeleteComponent implements OnInit {
  public user: User;
  public isHimself: boolean;
  public errors: string[] = null;
  public onUserDelete: EventEmitter<User> = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    public currentUser: CurrentUserService,
    private _usersService: UsersService
  ) { }

  ngOnInit() {
    this.isHimself = this.user.id === this.currentUser.id;
  }

  public delete(): void {
    this._usersService
      .removeUser(this.user)
      .subscribe(
        () => {
          this.onUserDelete.emit(this.user);
        }
      );
  }
}
