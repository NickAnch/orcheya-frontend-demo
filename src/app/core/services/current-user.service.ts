import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { formHelper } from '../../shared/helpers/form.helper';

interface UserUpdate {
  name?: string;
  surname?: string;
  birthday?: string;
  sex?: string;
  email?: string;
  employmentAt?: string;
  github?: string;
  bitbucket?: string;
  skype?: string;
  phone?: string;
}

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

  public updateUser(userData: UserUpdate): Observable<User> {
    const url = '/api/profile';
    const data = { user: formHelper.objToUnderscore(userData) };

    return Observable.create((observer: Observer<User>) => {
      this._http
        .put(url, data, { observe: 'response' })
        .subscribe(
          res => {
            this._fromJSON(res.body['user']);
            observer.next(this);
            observer.complete();
          },
          err => {
            return observer.error(err);
          }
        )
      ;
    });
  }

  public signIn(email: string, password: string): Observable<boolean> {
    const data = { user: { email: email, password: password } };
    const url = '/api/users/sign_in';

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post(url, data, { observe: 'response' })
        .subscribe(
          resp => {
            this._fromJSON(resp.body);
            let token: string = resp.headers.get('authorization');
            token = token.substr(token.indexOf(' ') + 1);
            localStorage.setItem('token', token);
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
      this._http
        .delete(url)
        .subscribe(
          resp => {
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
