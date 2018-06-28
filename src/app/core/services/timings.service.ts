import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Timing } from '../models/timing';


const API_PATH = '/api/timings';

@Injectable()
export class TimingsService {
  constructor(private http: HttpClient) {}

  public getList(): Observable<Timing[]> {
    return Observable.create((observer: Observer<Timing[]>) => {
      this.http
        .get(API_PATH)
        .subscribe(
          res => {
            observer.next(Timing.newCollection(Timing, res['timings']));
            observer.complete();
          },
          err => observer.error(err['errors'])
        );
    });
  }
}
