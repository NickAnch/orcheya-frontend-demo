import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services';
import { Role } from '../../../core/models/role';
import { RoleEditComponent } from '../../components/role-edit/role-edit.component';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss']
})
export class RolesPage implements OnInit {
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
    this._rolesService
      .removeRole(role)
      .subscribe(
        () => this.roles.splice(this.roles.indexOf(role), 1)
      );
  }

  public addRole(role: Role): void {
    this._rolesService
      .addRole(role)
      .subscribe(x => this.roles.push(x));
  }

  public editRole(role: Role): void {
    const initialState = {
      role: role
    };
    const modal = this._modalService.show(RoleEditComponent, { initialState });
    modal.content
      .onRoleUpdate
      .subscribe(x => {
        role._fromJSON(x._toJSON());
        this.roles.splice(this.roles.indexOf(role), 1, x)
        modal.hide();
      });
  }
}
