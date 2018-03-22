import { Component, OnInit } from '@angular/core';
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
  public form: FormGroup;
  private _respErrors: Object = {};
  private _updatedUser = new User();

  constructor(
    public currentUser: CurrentUserService,
    private _formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      name: [this.currentUser.name, [Validators.required]],
      surname: [this.currentUser.surname, [Validators.required]],
      birthday: [this.currentUser.birthday, []],
      sex: [this.currentUser.sex, []],
      email: [
        this.currentUser.email,
        [Validators.required, Validators.email]
      ],
      employmentAt: [this.currentUser.employmentAt, []],
      github: [this.currentUser.github, []],
      bitbucket: [this.currentUser.bitbucket, []],
      skype: [this.currentUser.skype, []],
      phone: [this.currentUser.phone, []],
    });
  }

  public hasError(controlName: string): boolean {
    return !(this.form.get(controlName).valid && !this._respErrors[controlName]);
  }

  public updateUser() {
    if (!this.form.valid) {
      return;
    }

    this._updatedUser._fromJSON(this.form.value);

    this.currentUser
      .updateUser(this._updatedUser)
      .subscribe(
        () => this._respErrors = {},
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
