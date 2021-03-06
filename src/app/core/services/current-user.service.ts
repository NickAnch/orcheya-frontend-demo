import { Injectable } from '@angular/core';
import { IUserEdit, User } from '../models/user';
import {
  HttpClient, HttpEvent, HttpEventType, HttpHeaders,
  HttpProgressEvent, HttpRequest, HttpResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, last, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Model } from 'tsmodels';
import { Timing } from '../models/timing';
import { InvitedUser } from '../models/invited-user';

@Injectable()
export class CurrentUserService extends User {
  private apiProfilePath = '/api/profile';
  private apiUsersPath = '/api/users';
  public progressSubject = new Subject<number>();
  public avatarSubscription: Subscription;

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
    const data = { user: userData._toJSON() };
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

  public acceptInvite(invitedUser: InvitedUser) {
    const params = invitedUser._toJSON();

    return Observable.create((observer: Observer<boolean>) => {
      this.http
        .put(`${this.apiUsersPath}/invitation`, params, { observe: 'response' })
        .subscribe(
          resp => {
            CurrentUserService.setTokenByHeaders(resp.headers);
            observer.next(true);
            observer.complete();
          },
          resp => observer.error(resp.error['errors'])
        );
    });
  }

  public edit(): Observable<IUserEdit> {
    return Observable.create((observer: Observer<IUserEdit>) => {
      this.http
        .get(`${this.apiProfilePath}/edit`)
        .subscribe(
          res => {
            observer.next({
              timings: Model.newCollection(Timing, res['timings'])
            });
            observer.complete();
          },
          error => observer.error(error)
        );
      }
    );
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

    const req = new HttpRequest(
      'PUT',
      `${this.apiProfilePath}/update_avatar`,
      data,
      { reportProgress: true }
    );

    return Observable.create((observer: Observer<User>) => {
      this.avatarSubscription = this.http.request(req)
        .pipe(
          map((e: HttpEvent<any>) => {
            if (e.type === HttpEventType.UploadProgress) {
              const progress = e as HttpProgressEvent;
              this.progressSubject.next(
                Math.round(100 * progress.loaded / progress.total)
              );
            } else if (e.type === HttpEventType.Response) {
              return (<HttpResponse<{ user: User }>>e).body;
            }
          }),
          last(null),
          catchError(error => error)
        )
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

  public acceptTerms() {
    return Observable.create((observer: Observer<User>) => {
      this.http
        .post(`/api/agreement/accept`, {})
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
}
