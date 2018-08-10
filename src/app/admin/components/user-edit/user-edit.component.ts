import { Component, EventEmitter, OnInit } from '@angular/core';
import { UsersService } from '../../services';
import { Role } from '../../../core/models/role';
import { User } from '../../../core/models/user';
import { ValidateLatin } from '../../../core/validators/latin.validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatNumber } from '../../../shared/helpers/phone-formatter.helper';
import { Timing } from '../../../core/models/timing';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  public userId: number;
  public user: User;
  public roles: Role[];
  public timings: Timing[];
  public form: FormGroup;
  public onUserUpdate: EventEmitter<User> = new EventEmitter();

  private _respErrors: Object = {};

  constructor(private _usersService: UsersService,
              private _formBuilder: FormBuilder,
              public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this._usersService
      .edit(this.userId)
      .subscribe(x => {
        this.user = x.user;
        this.roles = x.roles;
        this.timings = x.timings;
        this.initializeForm();
      });
  }

  public initializeForm(): void {
    this.form = this._formBuilder.group({
      name: [this.user.name, [Validators.required, ValidateLatin]],
      surname: [this.user.surname, [Validators.required, ValidateLatin]],
      birthday: [new Date(this.user.birthday), [Validators.required]],
      sex: [this.user.sex, []],
      email: [this.user.email, [Validators.required, Validators.email]],
      skype: [this.user.skype, []],
      phone: [this.user.phone, [Validators.required]],
      timingId: [this.user.timingId, [Validators.required]],
      roleId: [this.user.roleId, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      notifyUpdate: [this.user.notifyUpdate, []],
    });
    this.formatCurrentUserNumber();
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

    this._usersService
      .update(this.user)
      .subscribe(
        user => {
          this._respErrors = {};
          this.onUserUpdate.emit(user);
        },
        (err: HttpErrorResponse) => {
          if (!err.error['status'] && !err.error['exception']) {
            this._respErrors = err.error;
          }
        },
        () => null);
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
