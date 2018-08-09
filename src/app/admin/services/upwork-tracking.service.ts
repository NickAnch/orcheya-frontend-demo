import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import {
  WorklogControl, IWorklogControlRequest
} from '../../core/models/worklog-control';

const ADMIN_WORKLOG_CONTROL_URL = 'api/admin/worklog_transfers';

@Injectable()
export class WorklogsControlService {
  constructor(private _http: HttpClient) {}

  public getWorklogsControlList(): Observable<WorklogControl[]> {
    return Observable.create((observer: Observer<WorklogControl[]>) => {
      this._http
        .get<WorklogControl[]>(ADMIN_WORKLOG_CONTROL_URL)
        .subscribe(
          (response) => {
            observer.next(WorklogControl.newCollection(
              WorklogControl, response || []
            )
            );
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public addWorklogControl(
    worklogControl: IWorklogControlRequest
  ): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post<WorklogControl>(
          `${ADMIN_WORKLOG_CONTROL_URL}`, worklogControl
        )
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public editWorklogControl(
    worklogControl: IWorklogControlRequest
  ): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .put(`${ADMIN_WORKLOG_CONTROL_URL}/${worklogControl.id}`,
             worklogControl)
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
