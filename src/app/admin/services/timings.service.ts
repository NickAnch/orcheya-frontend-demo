import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Timing } from '../../core/models/timing';

const ADMIN_TIMINGS_URL = '/api/admin/timings';

@Injectable()
export class TimingsService {
  constructor(private _http: HttpClient) {}

  public getTimingsList(): Observable<Timing[]> {
    return Observable.create((observer: Observer<Timing[]>) => {
      this._http
        .get(ADMIN_TIMINGS_URL)
        .subscribe(
          response => {
            observer.next(Timing.newCollection(Timing, response['timings']));
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public add(timing: Timing): Observable<Timing> {
    console.log(timing);
    return Observable.create((observer: Observer<Timing>) => {
      this._http
        .post<Timing>(`${ADMIN_TIMINGS_URL}`, timing._toJSON())
        .subscribe(
          response => {
            observer.next(Timing.new(Timing, response['timing']));
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public remove(timing: Timing, newTimingId: number): Observable<boolean> {
    const httpParams = new HttpParams()
      .set('new_timing', newTimingId.toString());

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .delete(`${ADMIN_TIMINGS_URL}/${timing.id}`, {params: httpParams})
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }
}
