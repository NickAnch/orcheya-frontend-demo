import { Component, EventEmitter, OnInit } from '@angular/core';
import { ValidateLatin } from '../../../core/validators/latin.validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../../core/models/role';
import { RolesService } from '../../services';

@Component({
  selector: 'app-role-delete',
  templateUrl: './role-delete.component.html',
  styleUrls: ['./role-delete.component.scss']
})

export class RoleDeleteComponent implements OnInit {
  public role: Role;
  public roles: Role[];

  public enabledRoles: Role[];
  public newRoleId: number;

  public onRoleDelete: EventEmitter<object> = new EventEmitter();

  public errors: string[] = null;

  constructor(private _rolesService: RolesService,
              public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.enabledRoles = this.roles.filter(role => role !== this.role);
  }

  public delete() {
    const newRole = this.roles.find(r => r.id === Number(this.newRoleId));
    this._rolesService
      .removeRole(this.role, newRole)
      .subscribe(
        () => {
          this.onRoleDelete.emit({ deleted: this.role, newed: newRole });
        },
        (err: HttpErrorResponse) => {
          if (err.error && err.error.base && err.error.base.length > 0) {
            this.errors = err.error.base;
          } else {
            this.errors = ['Unknown error'];
          }
        }
      );
  }
}
