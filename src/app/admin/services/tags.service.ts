import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Tag } from '../../core/models/tag';

const ADMIN_TAGS_URL = '/api/admin/event_tags';

@Injectable()
export class TagsService {

  constructor(private _http: HttpClient) { }

  public getTags(): Observable<Tag[]> {
    return Observable.create((observer: Observer<Tag[]>) => {
      this._http
          .get<Tag[]>(ADMIN_TAGS_URL)
          .subscribe(
            (response: any) => {
              observer.next(Tag.newCollection(Tag, response));
              observer.complete();
            },
            (error) => observer.error(error)
          );
    });
  }

  public addTag(tag: Tag): Observable<Tag> {
    return Observable.create((observer: Observer<Tag>) => {
      this._http
          .post<Tag>(ADMIN_TAGS_URL, tag._toJSON())
          .subscribe(
            (response: any) => {
              observer.next(Tag.new(Tag, response));
              observer.complete();
            },
            (error) => observer.error(error)
          );
    });
  }

  public editTag(tag: Tag): Observable<Tag> {
    return Observable.create((observer: Observer<Tag>) => {
      this._http
          .put<Tag>(`${ADMIN_TAGS_URL}/${tag.id}`, tag._toJSON())
          .subscribe(
            (response: any) => {
              observer.next(Tag.new(Tag, response));
              observer.complete();
            },
            (error) => observer.error(error)
          );
    });
  }

  public deleteTag(tag: Tag, newTag: Tag): Observable<boolean> {
    const httpParams = new HttpParams()
      .set('new_event_tag', newTag.id.toString());
    return Observable.create((observer: Observer<boolean>) => {
      this._http
          .delete<Tag>(`${ADMIN_TAGS_URL}/${tag.id}`, {params: httpParams})
          .subscribe(
            () => {
              observer.next(true);
              observer.complete();
            },
            (error) => observer.error(error)
          );
    });
  }

}
