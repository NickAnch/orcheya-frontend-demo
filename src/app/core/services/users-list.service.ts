import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { User } from '../models/user';

@Injectable()
export class UsersListService {
  private apiPath = '/api/users';

  constructor(private http: HttpClient) {
  }

  public getUsersList(page): Observable<any> {
    return this.http.get(`${this.apiPath}?page=${page}`);
  }

  public getSearch(searchString): Observable<any> {
    return this.http.get(`${this.apiPath}?search=${searchString}`);
  }

  public getUserById(id: number): Observable<User> {
    return Observable.create((observer: Observer<User>) => {
      this.http
          .get(`${this.apiPath}/${id}`)
          .subscribe(
            (data: { user: User }) => {
              observer.next(data.user);
              observer.complete();
            },
            err => observer.error(err)
          );
    });
  }
}
