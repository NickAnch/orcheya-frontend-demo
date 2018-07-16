import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import {
  ProjectDynamicGraph,
  UsersDynamicGraph
} from '../models';
import { Model } from 'tsmodels';

export interface UsersAndProjectsResponse {
  datesData: string[];
  usersData: UsersDynamicGraph[];
  projectsData: ProjectDynamicGraph[];
}

const URL = '/api/reports/users_and_projects';

@Injectable()
export class UsersAndProjectsService {
  constructor(private http: HttpClient) {}

  getServiceLoad(startDate: string, endDate: string, step: string)
    : Observable<UsersAndProjectsResponse> {
    return Observable
      .create((observer: Observer<UsersAndProjectsResponse>) => {
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
              const projectsTable = Model.newCollection(
                ProjectDynamicGraph, data.projects_table
              );

              observer.next({
                datesData: datesData,
                usersData: usersTable,
                projectsData: projectsTable,
              });

              observer.complete();
            },
            err => observer.error(err)
          );
      });
  }
}
