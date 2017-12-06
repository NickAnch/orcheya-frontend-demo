import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class CurrentUserService extends User {

  constructor(private _http: HttpClient) {
    super();
   }

  /**
   * @returns Is user loggined in.
   */
  public isLoggedIn(): boolean {
    return !!this.id;
  }

 /**
  * Loading current user's data from server.
  * This's necessary for firsting load of head-page.
  *
  * @returns Current user, if this is exist.
  */
  public load(): Observable<User> {
   return Observable.create((observer: Observer<User>) => {
     this._http
       .get('api/profile')
       .subscribe(
         res => {
           this._fromJSON(res);
           observer.next(this);
           observer.complete();
         },
         error => observer.error(error)
       );
     }
   );
 }

  public login(email: string, password: string): Observable<boolean> {
    const data = { email: email, password: password };
    const url = '/api/sign_in';

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post(url, data)
        .subscribe(
          resp => {
            this._fromJSON(resp['user']);
            localStorage.setItem('token', resp['token']);
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
