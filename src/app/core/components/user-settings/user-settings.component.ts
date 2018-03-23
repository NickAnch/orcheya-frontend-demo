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
  private respErrors: Object = {};
  private updatedUser = new User();

  constructor(
    public currentUser: CurrentUserService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
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
    return !(this.form.get(controlName).valid && !this.respErrors[controlName]);
  }

  public updateSettings() {
    if (!this.form.valid) {
      return;
    }

    this.updatedUser._fromJSON(this.form.value);

    this.currentUser
      .updateSettings(this.updatedUser)
      .subscribe(
        () => this.respErrors = {},
        (err: HttpErrorResponse) => {
          if (!err.error['status'] && !err.error['exception']) {
            this.respErrors = err.error;
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

    if (this.respErrors[controlName]) {
      return this.respErrors[controlName];
    }
  }
}
