import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services';
import { Role } from '../../../core/models/role'

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss']
})
export class RolesPage implements OnInit {
  public roles: Role[];

  constructor(private _rolesService: RolesService) { }

  ngOnInit() {
    this._rolesService
      .getRolesList()
      .subscribe(x => this.roles = x);
  }

}
