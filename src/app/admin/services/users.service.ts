import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { User } from '../../core/models/user';


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
}
