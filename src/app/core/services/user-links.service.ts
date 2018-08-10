import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

import { UserLink } from '../models/user-links';

@Injectable()
export class UserLinksService {
  public userLinksData: UserLink[] = [];
  public links = new Subject<UserLink[]>();

  constructor(private _http: HttpClient) {}

  public getUserLinks(user_id: number): Observable<boolean> {
    const url = this._makeUrl(user_id);
    return Observable.create((observer: Observer<boolean>) => {
      return this._http
        .get(url)
        .subscribe((response: UserLink[]) => {
          this.userLinksData.splice(0, this.userLinksData.length);
          response.forEach(link => {
            this.userLinksData.push(link);
          });
          this.links.next(response);
          observer.next(true);
          observer.complete();
        });
    });
  }

  private _makeUrl(id: number): string {
    return `/api/users/${id}/links`;
  }

  public newUserLink(link: UserLink, id: number): Observable<UserLink> {
    return Observable.create((observer: Observer<any>) => {
      return this._http
      .post(this._makeUrl(id), link)
      .subscribe((response: UserLink) => {
          this.userLinksData.push(response);
          observer.next(response);
          observer.complete();
        });
    });
  }

  public updateUserLink(link: UserLink, id: number): Observable<UserLink> {
    return Observable.create((observer: Observer<object>) => {
      return this._http
      .put(`${this._makeUrl(id)}/${link.id}`, link)
      .subscribe((response: UserLink) => {
          const updatedLink = this.userLinksData.find((l: UserLink) => {
            return l.id === link.id;
          });
          updatedLink.link = link.link;
          updatedLink.kind = response.kind;
          observer.next(response);
          observer.complete();
        });
    });
  }

  public removeUserLink(
    id: number,
    userId: number,
    index: number
  ): Observable<object> {
    return Observable.create((observer: Observer<object>) => {
      return this._http
      .delete(`${this._makeUrl(userId)}/${id}`)
      .subscribe(response => {
          this.userLinksData.splice(index, 1);
          observer.next(response);
          observer.complete();
        });
    });
  }
}
