import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CurrentUserService } from '../../services/current-user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html'
})
export class UserSettingFormComponent implements OnInit {
  public form: FormGroup;
  private respErrors: Object = {};
  private updatedUser = new User();
  public schedule = [
    '08:00 - 17:00',
    '09:00 - 18:00',
    '10:00 - 19:00',
    '11:00 - 20:00',
    'flexible'
  ];

  constructor(public currentUser: CurrentUserService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.currentUser.name, [Validators.required]],
      surname: [this.currentUser.surname, [Validators.required]],
      birthday: [this.currentUser.birthday, [Validators.required]],
      sex: [this.currentUser.sex, []],
      email: [
        this.currentUser.email,
        [Validators.required, Validators.email]
      ],
      github: [this.currentUser.github, []],
      bitbucket: [this.currentUser.bitbucket, []],
      skype: [this.currentUser.skype, []],
      phone: [this.currentUser.phone, [Validators.required]],
      timing: ['09:00 - 18:00', [Validators.required]]
    });
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty && this.form.get(controlName).invalid)
      || this.respErrors[controlName]
    );
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
        },
        () => this.router.navigate(['/profile']));
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }

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
