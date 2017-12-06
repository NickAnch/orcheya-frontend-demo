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
   * @returns Is user logged in.
   */
  public isLoggedIn(): boolean {
    return !!this.id;
  }

 /**
  * Loading current user's data from server.
  * This is necessary for first load of head-page.
  *
  * @returns Current user, if exists
  */
  public load(): Observable<User> {
   return Observable.create((observer: Observer<User>) => {
     this._http
       .get('/api/profile')
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

  public signIn(email: string, password: string): Observable<boolean> {
    const data = { email: email, password: password };
    const url = '/api/sign-in';

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

  public signOut(): Observable<boolean> {
    const url = '/api/sign-out';
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .delete(url)
        .subscribe(
          resp => {
            // this.dispose();
            localStorage.setItem('token', resp['token']);
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
