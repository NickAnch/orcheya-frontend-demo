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
    let str = '?';

    if (filter) {
      const obj = filter._toJSON() as { [param: string]: string | string[]; };

      for (const key in obj) {
        if (obj.hasOwnProperty(key) && !obj[key]) {
          delete(obj[key]);
        }
      }

      Object.keys(obj).forEach(key => {
        if (Array.isArray(obj[key])) {
          (<Array<string>>obj[key]).forEach(id => {
            str += key + '[]=' + id + '&';
          });
        } else {
          str += key + '=' + obj[key] + '&';
        }
      });
    }

    str = str.slice(0, -1);

    return Observable.create((observer: Observer<UpdatesResponse>) => {
      this.http
        .get(`${this.apiUrl}${str}`)
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
