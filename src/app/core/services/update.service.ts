import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Update } from '../models/update';
import { UpdateFilter } from '../models/update-filter';
import { Meta } from '../models/meta.interface';
import { FilterHttpHelper } from '../../shared/helpers/filter-http.helper';

export interface UpdatesResponse {
  updates: Update[];
  meta: Meta;
}

@Injectable()
export class UpdateService {
  private apiUrl = '/api/updates';

  constructor(private http: HttpClient) {}

  getUpdates(filter?: UpdateFilter): Observable<UpdatesResponse> {
    const query = FilterHttpHelper.getQueryStrByFilter(filter);

    return Observable.create((observer: Observer<UpdatesResponse>) => {
      this.http
        .get(`${this.apiUrl}${query}`)
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
