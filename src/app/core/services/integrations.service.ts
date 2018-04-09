import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CurrentUserService } from './current-user.service';
import { User } from '../models/user';

@Injectable()
export class IntegrationsService {
  private apiUrl = '/api/integration';

  constructor(
    private http: HttpClient,
    private user: CurrentUserService,
  ) {}

  private static redirectByUrl(url: string) {
    window.location.href = url;
  }

  slackConnect() {
    this.http.get(`${this.apiUrl}/slack`).subscribe(
      resp => IntegrationsService.redirectByUrl(resp['uri'])
    );
  }

  slackDisconnect(): Observable<User> {
    return Observable.create((observer: Observer<User>) => {
        this.http
          .get(`${this.apiUrl}/slack/disconnect`)
          .subscribe(
            res => {
              this.user._fromJSON(res['user']);
              observer.next(this.user);
              observer.complete();
            },
            error => observer.error(error)
          );
      }
    );
  }

  timeDoctorConnect() {
    this.http.get(`${this.apiUrl}/timedoctor`).subscribe(
      resp => IntegrationsService.redirectByUrl(resp['uri'])
    );
  }

  timeDoctorDisconnect(): Observable<User> {
    return Observable.create((observer: Observer<User>) => {
        this.http
          .get(`${this.apiUrl}/timedoctor/disconnect`)
          .subscribe(
            res => {
              this.user._fromJSON(res['user']);
              observer.next(this.user);
              observer.complete();
            },
            error => observer.error(error)
          );
      }
    );
  }
}
