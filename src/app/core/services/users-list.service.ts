import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';

@Injectable()
export class UsersListService extends User {
  private apiPath = '/api/users';

  constructor(private http: HttpClient) {
    super();
  }

  public getUsersList(page): Observable<any> {
    return this.http.get(`${this.apiPath}?page=${page}`);
  }

  public getSearch(searchString): Observable<any> {
    return this.http.get(`${this.apiPath}?search=${searchString}`);
  }


}
