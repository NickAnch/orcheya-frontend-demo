import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import {
  Dash,
  ProjectsTableRow,
  UsersTableRow
} from '../models';
import { Model } from 'tsmodels';

export interface ServiceLoadResponse {
  dash: Dash;
  datesData: string[];
  loadTable: number[];
  usersTable: UsersTableRow[];
  projectsTable: ProjectsTableRow[];
}

const URL = '/api/reports/service_load';

@Injectable()
export class ServiceLoadService {
  constructor(private http: HttpClient) {}

  getServiceLoad(startDate: string, endDate: string, step: string)
    : Observable<ServiceLoadResponse> {
    return Observable.create((observer: Observer<ServiceLoadResponse>) => {
      const httpParams = new HttpParams()
        .set('start_date', startDate)
        .set('step', step)
        .set('end_date', endDate);

      this.http
        .get(URL, {params: httpParams})
        .subscribe(
          (data: any) => {
            const dash = Model.new(Dash, data.dash);
            const usersTable = Model.newCollection(
              UsersTableRow, data.users_table
            );
            const datesData = data.dates;
            const loadTable = data.load_table;
            const projectsTable = Model.newCollection(
              ProjectsTableRow, data.projects_table
            );

            observer.next({
              dash: dash,
              datesData: datesData,
              loadTable: loadTable,
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
