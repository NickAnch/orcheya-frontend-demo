import { Component, EventEmitter, OnInit } from '@angular/core';
import { ValidateLatin } from '../../../core/validators/latin.validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../../core/models/role';
import { RolesService } from '../../services';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit {
  public role: Role;
  public form: FormGroup;
  public onRoleUpdate: EventEmitter<Role> = new EventEmitter();

  private _respErrors: Object = {};

  constructor(private _rolesService: RolesService,
              private  _formBuilder: FormBuilder,
              public bsModalRef: BsModalRef) {

  }

  ngOnInit() {
    this.form = this._formBuilder.group({
      name: [this.role.name, [Validators.required, ValidateLatin]],
      isAdmin: [this.role.isAdmin, []],
      isDeveloper: [this.role.isDeveloper, []],
    });
  }

  public updateSettings() {
    if (this.form.invalid) {
      return;
    }

    Object.assign(this.role, this.form.value);

    this._rolesService
      .editRole(this.role)
      .subscribe(
        role => {
          this._respErrors = {};
          this.onRoleUpdate.emit(role);
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

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this._respErrors[controlName]
    );
  }
}
