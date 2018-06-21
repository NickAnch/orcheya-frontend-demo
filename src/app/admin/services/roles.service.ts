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

  public addRole(role: Role): Observable<Role> {
    return Observable.create((observer: Observer<Role>) => {
      this._http
        .post<Role>(`${ADMIN_ROLES_URL}`, role._toJSON())
        .subscribe(
          response => {
            observer.next(Role.new(Role, response['role']));
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public removeRole(role: Role): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .delete(`${ADMIN_ROLES_URL}/${role.id}`)
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public editRole(role: Role): Observable<Role> {
    return Observable.create((observer: Observer<Role>) => {
      this._http
        .put(`${ADMIN_ROLES_URL}/${role.id}`, role._toJSON())
        .subscribe(
          response => {
            observer.next(Role.new(Role, response['role']));
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
