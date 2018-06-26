import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { TimesheetFilter } from '../models/timesheet-filter';
import {
  TimesheetRow
} from '../models/timesheet';
import { Model } from 'tsmodels';

export interface TimesheetResponse {
  timesheetRows: TimesheetRow[];
}

const URL = '/api/reports/timesheet';

@Injectable()
export class TimesheetService {
  constructor(private http: HttpClient) {}

  getTimesheet(filter: TimesheetFilter)
    : Observable<TimesheetResponse> {
    let params = new HttpParams()
      .set('start_date', filter.dates[0].toDateString())
      .set('end_date', filter.dates[1].toDateString());

    if (filter.paid) {
      params = params.set('paid', filter.paid.toString());
    }

    if (filter.users.length > 0) {
      params = params.set('users_ids', filter.users
        .map(user => user.id).join(','));
    }

    if (filter.roles.length > 0) {
      params = params.set('roles_ids', filter.roles
        .map(role => role.id).join(','));
    }

    return Observable.create((observer: Observer<TimesheetResponse>) => {
      this.http.get(URL, {params: params})
        .subscribe(
          (data: any) => {
            const timesheetRows = Model.newCollection(
              TimesheetRow, data
            );

            observer.next({timesheetRows: timesheetRows});
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

}
