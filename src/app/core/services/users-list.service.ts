import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '../models/user';

import { TimeActivity } from '../models/time-activity.interface';
import { Meta } from '../models/meta.interface';

export interface UsersListResponse {
  users: User[];
  meta: Meta;
}

@Injectable()
export class UsersListService {
  private apiPath = '/api/users';
  private _timeDoctorTime: TimeActivity[] = [];

  constructor(private http: HttpClient) {}

  public get timeDoctorTime(): TimeActivity[] {
    return this._timeDoctorTime.slice();
  }

  public set timeDoctorTime(data: TimeActivity[]) {
    this._timeDoctorTime = data;
  }

  public getUsersList(page = 1, limit = 25): Observable<UsersListResponse> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    return Observable.create((observer: Observer<UsersListResponse>) => {
      this.http
          .get(this.apiPath, { params })
          .subscribe(
            (data: UsersListResponse) => {
              data.users = data.users.map(
                user => new User(user)
              );

              observer.next(data);
              observer.complete();
            },
            err => observer.error(err)
          );
    });
  }

  public getSearch(search: string): Observable<UsersListResponse> {
    const params = new HttpParams()
      .set('search', search);

    return Observable.create((observer: Observer<UsersListResponse>) => {
      this.http
        .get(this.apiPath, { params })
        .subscribe(
          (data: UsersListResponse) => {
            data.users = data.users.map(
              user => new User(user)
            );

            observer.next(data);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public getTimeActivity(
    id: number, dateFrom: Date, dateTo: Date
  ): Observable<TimeActivity[]> {
    const params = new HttpParams()
      .set('start_date', dateFrom.toISOString().substr(0, 10))
      .set('end_date', dateTo.toISOString().substr(0, 10));

    return Observable.create((observer: Observer<TimeActivity[]>) => {
      this.http
        .get(`${this.apiPath}/${id}/timegraph`, { params: params })
        .subscribe(
          (data: TimeActivity[]) => {
            observer.next(data);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public getUserTimeStatsById(id: number) {
    return this.http.get(`${this.apiPath}/${id}/stats`);
  }

  public getUserById(id: number): Observable<User> {
    return Observable.create((observer: Observer<User>) => {
      this.http
        .get(`${this.apiPath}/${id}`)
        .subscribe(
          (res: { user: User }) => {
            const user = new User(res.user);
            observer.next(user);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
