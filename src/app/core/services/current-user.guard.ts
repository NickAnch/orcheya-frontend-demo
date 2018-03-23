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

  constructor(private currentUser: CurrentUserService,
              private router: Router) {}

  public canActivate(): Observable<boolean> | boolean {
    if (this.currentUser.isLoggedIn()) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {
      this.currentUser.load()
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          () => {
            this.router.navigate(['/sign-in']);
            observer.next(false);
          }
        );
    });
  }
}
