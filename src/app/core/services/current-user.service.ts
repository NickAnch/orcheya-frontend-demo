import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

export const URL = `api/profile`;

@Injectable()
export class CurrentUserService extends User {

  constructor(private _http: HttpClient) {
    super();
   }

  public load(): Observable<User> {
    return Observable.create(
      (observer: Observer<User>) => {
        this._http
          .get(URL)
          .subscribe(
            (res: any) => {
              this._fromJSON(res);
              observer.next(this);
              observer.complete();
            },
            error => observer.error(error)
          );
      }
    );
  }
}
