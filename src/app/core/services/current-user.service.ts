import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';


@Injectable()
export class CurrentUserService extends User {

  constructor(private http: HttpClient) {
    super();
   }

  static setTokenByHeaders(headers: HttpHeaders) {
    let token: string = headers.get('authorization');
    token = token.substr(token.indexOf(' ') + 1);
    localStorage.setItem('token', token);
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
     this.http
       .get('/api/profile', { observe: 'response' })
       .subscribe(
         res => {
           this._fromJSON(res.body['user']);
           observer.next(this);
           observer.complete();
         },
         error => observer.error(error)
       );
     }
   );
 }

  public updateSettings(userData: User = this): Observable<User> {
    const url = '/api/profile';
    const data = { user: userData };

    return Observable.create((observer: Observer<User>) => {
      this.http
        .put(url, data, { observe: 'response' })
        .subscribe(
          res => {
            this._fromJSON(res.body['user']);
            observer.next(this);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public acceptInvite(invToken: string, password: string) {
    const params = { invitation_token: invToken, password: password };
    const url = '/api/users/invitation';

    return Observable.create((observer: Observer<boolean>) => {
      this.http
        .put(url, params, { observe: 'response' })
        .subscribe(
          resp => {
            CurrentUserService.setTokenByHeaders(resp.headers);
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public signIn(email: string, password: string): Observable<boolean> {
    const data = { user: { email: email, password: password } };
    const url = '/api/users/sign_in';

    return Observable.create((observer: Observer<boolean>) => {
      this.http
        .post(url, data, { observe: 'response' })
        .subscribe(
          resp => {
            this._fromJSON(resp.body);
            CurrentUserService.setTokenByHeaders(resp.headers);
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public signOut(): Observable<boolean> {
    const url = '/api/users/sign_out';
    return Observable.create((observer: Observer<boolean>) => {
      this.http
        .delete(url)
        .subscribe(
          () => {
            // this.dispose();
            localStorage.removeItem('token');
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
