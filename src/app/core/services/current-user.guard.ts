import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CurrentUserService } from './current-user.service';

/**
 * This component, which can to give permissions for load another component.
 */

@Injectable()
export class CurrentUserGuard implements CanActivate {

  constructor(private _currentUser: CurrentUserService,
              private _router: Router) {}

  public canActivate(): Observable<boolean> | boolean {
    if (this._currentUser.isLoggedIn()) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {
      this._currentUser.load()
        .subscribe(
          user => {
            observer.next(true);
            observer.complete();
          },
          error => {
            this._router.navigate(['/login']);
            observer.next(false);
          }
        );
    });
  }
}
