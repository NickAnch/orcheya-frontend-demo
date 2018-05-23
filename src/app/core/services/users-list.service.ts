import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { User } from '../models/user';

import { TimeActivity } from '../models/time-activity.interface';
import { Meta } from '../models/meta.interface';
import { UserFilter } from '../models/user-filter';
import { FilterHttpHelper } from '../../shared/helpers/filter-http.helper';
import { TimeGraphFilter } from '../models/timegraph-filter';
import { Subject } from 'rxjs/Subject';

export interface UsersListResponse {
  users: User[];
  meta: Meta;
}

@Injectable()
export class UsersListService {
  private apiPath = '/api/users';

  constructor(private http: HttpClient) {}

  public integrationTimeSubject = new Subject<TimeActivity[]>();

  public getUsersList(filter?: UserFilter): Observable<UsersListResponse> {
    const query = FilterHttpHelper.getQueryStrByFilter(filter);

    return Observable.create((observer: Observer<UsersListResponse>) => {
      this.http
          .get(`${this.apiPath}${query}`)
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

  public getIntegrationTime(filter: TimeGraphFilter): void {
    const query = FilterHttpHelper.getQueryStrByFilter(filter);

    this.http
      .get(`${this.apiPath}/${filter.id}/timegraph${query}`)
      .subscribe((data: TimeActivity[]) => (
        this.integrationTimeSubject.next(data)
      ));
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
