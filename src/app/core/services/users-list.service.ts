import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsersListService {

  constructor(private _http: HttpClient) {
  }

  public getUsersList(page): Observable<any> {
    return this._http.get(`/api/users?page=${page}`);
  }

  public getSearch(searchString): Observable<any> {
    return this._http.get(`/api/users?search=${searchString}`);
  }
}
