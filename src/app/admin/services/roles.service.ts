import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Role } from '../../core/models/role';


const ADMIN_ROLES_URL = '/api/admin/roles';

@Injectable()
export class RolesService {
  constructor(private _http: HttpClient) {}

  public getRolesList(): Observable<Role[]> {
    return Observable.create((observer: Observer<Role[]>) => {
      this._http
        .get(ADMIN_ROLES_URL)
        .subscribe(
          response => {
            observer.next(Role.newCollection(Role, response['roles']));
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
