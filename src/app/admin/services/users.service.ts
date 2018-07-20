import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { IUsersIndex, IUserEdit, User } from '../../core/models/user';
import { Role } from '../../core/models/role';
import { Timing } from '../../core/models/timing';


const ADMIN_USERS_URL = '/api/admin/users';

@Injectable()
export class UsersService {
  constructor(private _http: HttpClient) {}

  public getUsersList(): Observable<IUsersIndex> {
    return Observable.create((observer: Observer<IUsersIndex>) => {
      this._http
        .get(ADMIN_USERS_URL)
        .subscribe(
          resp => {
            observer.next({
              users: User.newCollection(User, resp['users'] || []),
              roles: Role.newCollection(Role, resp['meta']['roles']),
              deletedUsers: User.newCollection(
                User, resp['deleted_users'] || []
              )
            });
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public invite(email: string, roleId: number): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post(ADMIN_USERS_URL, { email: email, role_id: roleId })
        .subscribe(
          resp => {
            observer.next(true);
            observer.complete();
            },
          err => observer.error(err)
        );
    });
  }

  public edit(userId: number): Observable<IUserEdit> {
    return Observable.create((observer: Observer<IUserEdit>) => {
      this._http
        .get(`${ADMIN_USERS_URL}/${userId}/edit`)
        .subscribe(
          resp => {
            observer.next({
              user: User.new(User, resp['user']),
              roles: Role.newCollection(Role, resp['meta']['roles']),
              timings: Timing.newCollection(Timing, resp['meta']['timings'])
            });
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public update(user: User): Observable<User> {
    return Observable.create((observer: Observer<User>) => {
      this._http
        .put(
          `${ADMIN_USERS_URL}/${user.id}`,
          { user: user._toJSON() }
          )
        .subscribe(
          resp => {
            observer.next(User.new(User, resp['user']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public removeUser(user: User): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .delete(`${ADMIN_USERS_URL}/${user.id}`)
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public restoreUser(user: User): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .get(`${ADMIN_USERS_URL}/${user.id}/restore`)
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }
}
