import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Role } from '../models/role';

const API_PATH = '/api/roles';

@Injectable()
export class RolesService {
  constructor(private http: HttpClient) {}

  public getList(): Observable<Role[]> {
    return Observable.create((observer: Observer<Role[]>) => {
      this.http
        .get(API_PATH)
        .subscribe(
          res => {
            observer.next(Role.newCollection(Role, res['roles']));
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
