import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { TimeActivity } from '../models/time-activity.interface';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class UsersListService extends User {
  private apiPath = '/api/users';

  constructor(private http: HttpClient) {
    super();
  }

  public getUsersList(page): Observable<any> {
    return this.http.get(`${this.apiPath}?page=${page}`);
  }

  public getSearch(searchString): Observable<any> {
    return this.http.get(`${this.apiPath}?search=${searchString}`);
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
}
