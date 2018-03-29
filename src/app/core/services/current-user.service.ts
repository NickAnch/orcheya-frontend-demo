import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';


@Injectable()
export class CurrentUserService extends User {
  private apiProfilePath = '/api/profile';
  private apiUsersPath = '/api/users';

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
       .get(this.apiProfilePath, { observe: 'response' })
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
    const data = { user: userData };

    return Observable.create((observer: Observer<User>) => {
      this.http
        .put(this.apiProfilePath, data, { observe: 'response' })
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

    return Observable.create((observer: Observer<boolean>) => {
      this.http
        .put(`${this.apiUsersPath}/invitation`, params, { observe: 'response' })
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

    return Observable.create((observer: Observer<boolean>) => {
      this.http
        .post(`${this.apiUsersPath}/sign_in`, data, { observe: 'response' })
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
    return Observable.create((observer: Observer<boolean>) => {
      this.http
        .delete(`${this.apiUsersPath}/sign_out`)
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

  public uploadAvatar(image: File): Observable<User> {
    const data = new FormData();
    data.append('avatar', image, image.name);

    return Observable.create((observer: Observer<User>) => {
      this.http
        .put(`${this.apiProfilePath}/update_avatar`, data)
        .subscribe(
          res => {
            this._fromJSON(res['user']);
            observer.next(this);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  public getUserById(id: number): Observable<User> {
    return Observable.create((observer: Observer<User>) => {
      this.http
        .get(`${this.apiUsersPath}/${id}`)
        .subscribe(
          res => {
            this._fromJSON(res['user']);
            observer.next(this);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
