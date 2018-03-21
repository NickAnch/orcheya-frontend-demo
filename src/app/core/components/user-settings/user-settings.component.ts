import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CurrentUserService } from '../../services/current-user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  @Input('user') private _user: User;
  @Output() public userUpdate = new EventEmitter<User>();
  public form: FormGroup;
  private _respErrors: Object = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      name: [this._user ? this._user.name : null, [Validators.required]],
      surname: [this._user ? this._user.surname : null, [Validators.required]],
      birthday: [this._user ? this._user.birthday : null, []],
      sex: [this._user ? this._user.sex : null, []],
      email: [
        this._user ? this._user.email : null,
        [Validators.required, Validators.email]
      ],
      employmentAt: [this._user ? this._user.employmentAt : null, []],
      github: [this._user ? this._user.github : null, []],
      bitbucket: [this._user ? this._user.bitbucket : null, []],
      skype: [this._user ? this._user.skype : null, []],
      phone: [this._user ? this._user.phone : null, []],
    });
  }

  public hasError(controlName: string): boolean {
    return !(this.form.get(controlName).valid && !this._respErrors[controlName]);
  }

  public updateUser() {
    if (!this.form.valid) {
      return;
    }

    this._currentUserService
      .updateUser(this.form.value)
      .subscribe(
        user => {
          this._respErrors = {};
          this._user = user;
          this.userUpdate.emit(user);
        },
        (err: HttpErrorResponse) => {
          if (!err.error['status'] && !err.error['exception']) {
            this._respErrors = err.error;
          }
        }
      )
    ;
  }

  public textError(controlName: string): string {
    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors['required']) {
        return `${controlName} is required`;
      } else if (this.form.get(controlName).errors['email']) {
        return `${controlName} is not valid email`;
      }
    }

    if (this._respErrors[controlName]) {
      return this._respErrors[controlName];
    }
  }
}
