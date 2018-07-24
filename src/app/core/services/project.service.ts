import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { Observer } from 'rxjs/Observer';
import { Model } from 'tsmodels';

@Injectable()
export class ProjectService {
  private apiPath = '/api/projects';

  constructor(private http: HttpClient) {}

  public getProjectsList(): Observable<Project[]> {
    return Observable.create((observer: Observer<Project[]>) => {
      this.http
        .get(this.apiPath)
        .subscribe(
          (res: { projects: Project[] }) => {
            observer.next(Model.newCollection(Project, res.projects));
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public updateProject(id: number, data: object): Observable<Project> {
    return Observable.create((observer: Observer<Project>) => {
      this.http
        .put(`${this.apiPath}/${id}`, data)
        .subscribe(
          project => {
            const projects = new Project(project);
            observer.next(projects);
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }
}
