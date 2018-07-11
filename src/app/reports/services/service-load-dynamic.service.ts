import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { UsersDynamicGraph } from '../models';
import { Model } from 'tsmodels';

export interface ServiceLoadDynamicResponse {
  datesData: [string];
  usersData: UsersDynamicGraph[];
}

const URL = '/api/reports/service_load_dynamic';

@Injectable()
export class ServiceLoadDynamicService {
  constructor(private http: HttpClient) {}

  getServiceLoad(startDate: string, endDate: string, step: string)
    : Observable<ServiceLoadDynamicResponse> {
    return Observable
      .create((observer: Observer<ServiceLoadDynamicResponse>) => {
        const httpParams = new HttpParams()
          .set('start_date', startDate)
          .set('step', step)
          .set('end_date', endDate);

        this.http
          .get(URL, {params: httpParams})
          .subscribe(
            (data: any) => {
              const datesData = data.dates;
              const usersTable = Model.newCollection(
                UsersDynamicGraph, data.users_table
              );

              observer.next({
                datesData: datesData,
                usersData: usersTable,
              });

              observer.complete();
            },
            err => observer.error(err)
          );
      });
  }
}
