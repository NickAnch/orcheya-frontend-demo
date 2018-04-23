import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Update } from '../models/update';
import { UpdateFilter } from '../models/update-filter';
import { Meta } from '../models/meta.interface';

export interface UpdatesResponse {
  updates: Update[];
  meta: Meta;
}

@Injectable()
export class UpdateService {
  private apiUrl = '/api/updates';

  constructor(private http: HttpClient) {}

  getUpdates(filter?: UpdateFilter): Observable<UpdatesResponse> {
    let params = new HttpParams();

    if (filter) {
      const obj: Object = filter._toJSON();

      Object.keys(obj).forEach(prop => {
        if (obj.hasOwnProperty(prop) && obj[prop]) {
          params = params.set(prop, obj[prop]);
        }
      });
    }

    return Observable.create((observer: Observer<UpdatesResponse>) => {
      this.http
        .get(this.apiUrl, { params: params })
        .subscribe(
          (data: UpdatesResponse) => {
            const updates = data.updates
              .map(update => new Update(update));

            observer.next({
              updates,
              meta: data.meta,
            });
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

}
