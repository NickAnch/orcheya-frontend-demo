import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import {
  Dash,
  ProjectsTableRow,
  UsersTableRow
} from '../models/service-load';
import { Model } from 'tsmodels';

export interface ServiceLoadResponse {
  dash: Dash;
  usersTable: UsersTableRow[];
  projectsTable: ProjectsTableRow[];
}

const URL = '/api/reports/service_load';

@Injectable()
export class ServiceLoadService {
  constructor(private http: HttpClient) {}

  getServiceLoad(startDate: string, endDate: string)
    : Observable<ServiceLoadResponse> {
    return Observable.create((observer: Observer<ServiceLoadResponse>) => {
      const httpParams = new HttpParams()
        .set('start_date', startDate)
        .set('end_date', endDate);

      this.http
        .get(URL, {params: httpParams})
        .subscribe(
          (data: any) => {
            const dash = Model.new(Dash, data.dash);
            const usersTable = Model.newCollection(
              UsersTableRow, data.users_table
            );
            const projectsTable = Model.newCollection(
              ProjectsTableRow, data.projects_table
            );

            observer.next({
              dash: dash,
              usersTable: usersTable,
              projectsTable: projectsTable,
            });

            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

}
