import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class NotificationsService {
  constructor(private http: HttpClient) {}

  public read(id: number): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) =>
      this.http.post(`/api/notifications/${id}/read`, null)
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        )
    );
  }

  public readAll(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) =>
      this.http.post(`/api/notifications/read_all`, null)
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          err => observer.error(err)
        )
    );
  }

}
