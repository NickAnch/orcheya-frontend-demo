import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '../models/user';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class TimeDoctorConnectorService {

  constructor(
    private http: HttpClient,
    private user: CurrentUserService
  ) { }

  connect() {
    this.http.get('/api/integration/timedoctor').subscribe(
      resp => window.location.href = resp['uri']
    );
  }

  disconnect() {
    return Observable.create((observer: Observer<User>) => {
      this.http
        .get('/api/integration/timedoctor/disconnect', { observe: 'response' })
        .subscribe(
          res => {
            this.user._fromJSON(res.body['user']);
            observer.next(this.user);
            observer.complete();
          },
          error => observer.error(error)
        );
      }
    );
  }
}
