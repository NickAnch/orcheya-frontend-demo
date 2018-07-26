import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Update } from '../models/update';

@Injectable()
export class NewUpdateService {
  private getUpdatePath = '/api/users/'
  private apiPath = '/api/updates';

  constructor(private http: HttpClient) {}

  public getLastUpdate(id: number): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.http
        .get(`${this.getUpdatePath}/${id}/day_info`)
        .subscribe(
          res => {
            observer.next(res);
            observer.complete();
          }
        )
    })
  }

  public sendNewUpdate(update: Update): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.http
        .post(this.apiPath, update)
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          }
        )
    })
  }
}
