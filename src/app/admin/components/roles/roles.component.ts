import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services';
import { Role } from '../../../core/models/role';
import {
  RoleEditComponent,
  RoleDeleteComponent
} from '../index';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public roles: Role[];
  public canAdd = false;
  public role: Role = new Role();

  constructor(private _rolesService: RolesService,
              private _modalService: BsModalService) { }

  ngOnInit() {
    this._rolesService
      .getRolesList()
      .subscribe(x => this.roles = x);
  }

  public remove(role: Role): void {
    const initialState = {
      role: role,
      roles: this.roles
    };

    const modal = this._modalService
      .show(RoleDeleteComponent, { initialState });

    modal.content
      .onRoleDelete
      .subscribe(data => {
        this.roles
          .find(r => r === data.newed)
          .userCount += data.deleted.userCount;
        this.roles.splice(this.roles.findIndex(r => r === role), 1);
        modal.hide();
      });
  }

  public addRole(): void {
    const initialState = {
      role: new Role(),
      type: 'new'
    };
    const modal = this._modalService.show(RoleEditComponent, { initialState });
    modal.content
      .onRoleUpdate
      .subscribe(x => {
        this.roles.unshift(x);
        modal.hide();
      });
  }

  public editRole(role: Role): void {
    const initialState = {
      role: role,
      type: 'edit'
    };
    const modal = this._modalService.show(RoleEditComponent, { initialState });
    modal.content
      .onRoleUpdate
      .subscribe(x => {
        role._fromJSON(x._toJSON());
        this.roles.splice(this.roles.indexOf(role), 1, x);
        modal.hide();
      });
  }
}
