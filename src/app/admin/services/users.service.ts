import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { IUserEdit, User } from '../../core/models/user';
import { Role } from '../../core/models/role';
import { Timing } from '../../core/models/timing';


const ADMIN_USERS_URL = '/api/admin/users';

@Injectable()
export class UsersService {
  constructor(private _http: HttpClient) {}

  public getUsersList(): Observable<User[]> {
    return Observable.create((observer: Observer<User[]>) => {
      this._http
        .get(ADMIN_USERS_URL)
        .subscribe(
          resp => {
            observer.next(User.newCollection(User, resp['users']));
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
}
