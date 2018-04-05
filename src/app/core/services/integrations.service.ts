import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { CurrentUserService } from './current-user.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '../models/user';

@Injectable()
export class IntegrationsService {
  private apiUrl = '/api/integration';

  constructor(
    private http: HttpClient,
    private router: Router,
    private user: CurrentUserService,
  ) {}

  slackConnect() {
    this.http.get(`${this.apiUrl}/slack`).subscribe(
      resp => this.router.navigateByUrl(resp['uri'])
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
      resp => this.router.navigateByUrl(resp['uri'])
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
