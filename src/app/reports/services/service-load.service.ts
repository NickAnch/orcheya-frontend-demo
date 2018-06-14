import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Dash, HoursTableRow, ProjectsTableRow } from '../models/service-load';

export interface ServiceLoadResponse {
  dash: Dash;
  hoursTable: HoursTableRow[];
  projectsTable: ProjectsTableRow[];
}

@Injectable()
export class ServiceLoadService {
  private url = '/api/reports/service_load';

  constructor(private http: HttpClient) {}

  getServiceLoad(startDate: string, endDate: string)
    : Observable<ServiceLoadResponse> {
    return Observable.create((observer: Observer<ServiceLoadResponse>) => {
      this.http
        .get(`${this.url}?start_date=${startDate}&end_date=${endDate}`)
        .subscribe(
          (data: any) => {
            const dash = new Dash(data.dash);
            const hoursTable = data.hours_table
              .map(row => new HoursTableRow(row));
            const projectsTable = data.projects_table
              .map(row => new ProjectsTableRow(row));

            observer.next({
              dash: dash,
              hoursTable: hoursTable,
              projectsTable: projectsTable,
            });

            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

}
