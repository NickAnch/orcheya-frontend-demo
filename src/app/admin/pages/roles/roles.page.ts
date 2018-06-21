import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services';
import { Role } from '../../../core/models/role';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss']
})
export class RolesPage implements OnInit {
  public roles: Role[];
  public canAdd = false;
  public canEdit = false;
  public role: Role = new Role();

  constructor(private _rolesService: RolesService) { }

  ngOnInit() {
    this._rolesService
      .getRolesList()
      .subscribe(x => this.roles = x);
  }

  public removeRole(role: Role): void {
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
    this._rolesService
      .editRole(role)
      .subscribe(
        x => this.roles.splice(this.roles.indexOf(role), 1, x)
      );

  }
}
