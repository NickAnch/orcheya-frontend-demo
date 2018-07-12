import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

import { CurrentUserService } from '../../services/current-user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ValidateLatin } from '../../validators/latin.validator';
import { formatNumber } from '../../../shared/helpers/phone-formatter.helper';
import { Timing } from '../../models/timing';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html'
})
export class UserSettingFormComponent implements OnInit, OnDestroy {
  @Input() private navigateTo: string[] = [];
  public timings: Timing[];
  public form: FormGroup;
  public user: User;
  public showButton: boolean;
  private _respErrors: Object = {};
  private _subscription: Subscription;

  constructor(private _currentUser: CurrentUserService,
              private _formBuilder: FormBuilder,
              private _router: Router) {
    this.user = User.new<User>(User, this._currentUser._toJSON([
      'name', 'surname', 'birthday', 'sex', 'email', 'github',
      'bitbucket', 'skype', 'phone', 'timing_id', 'role', 'notify_update']));
    this._currentUser
      .edit()
      .subscribe(x => this.timings = x.timings);
  }

  ngOnInit() {
    this.showButton = !!this.navigateTo.length;
    this.form = this._formBuilder.group({
      name: [this.user.name, [Validators.required, ValidateLatin]],
      surname: [this.user.surname, [Validators.required, ValidateLatin]],
      birthday: [new Date(this.user.birthday), [Validators.required]],
      sex: [this.user.sex, []],
      email: [this.user.email, [Validators.required, Validators.email]],
      github: [this.user.github, []],
      bitbucket: [this.user.bitbucket, []],
      skype: [this.user.skype, []],
      phone: [this.user.phone, [Validators.required]],
      timingId: [this.user.timingId, [Validators.required]],
      notifyUpdate: [this.user.notifyUpdate, []]
    });
    this.formatCurrentUserNumber();
    if (!this.showButton) {
      this.subscribeChanges();
    }
  }

  ngOnDestroy() {
    if (!this.showButton) {
      this._subscription.unsubscribe();
    }
  }

  private subscribeChanges(): void {
    this._subscription =
      this.form
        .valueChanges
        .debounceTime(500)
        .subscribe(() => {
          if (this.form.valid) {
            this.updateSettings();
          }
        });
  }

  private formatCurrentUserNumber() {
    formatNumber(this.user.phone, this.form.get('phone'));
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this._respErrors[controlName]
    );
  }

  public updateSettings() {
    if (this.form.invalid) {
      return;
    }

    Object.assign(this.user, this.form.value);

    this._currentUser
      .updateSettings(this.user)
      .subscribe(
        () => this._respErrors = {},
        (err: HttpErrorResponse) => {
          if (!err.error['status'] && !err.error['exception']) {
            this._respErrors = err.error;
          }
        },
        () => {
          if (this.navigateTo.length) {
            this._router.navigate(this.navigateTo);
          }
        });
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
      } else if (this.form.get(controlName).errors['validLatin']) {
        return `${controlName} should contain only latin characters`;
      }
    }

    if (this._respErrors[controlName]) {
      return this._respErrors[controlName];
    }
  }
}
