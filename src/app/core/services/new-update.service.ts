import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class NewUpdateService {
  private apiPath = '/api/updates';

  constructor(private http: HttpClient) {}

  public getLastUpdate(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.http
        .get(`${this.apiPath}/2018-07-20`)
        .subscribe(
          res => {
            observer.next(res);
            observer.complete();
          }
        )
    })
  }
}
