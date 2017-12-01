import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CurrentUserService } from './current-user.service';

/**
 * This component, which can to give permissions for load another component.
 */

@Injectable()
export class CurrentUserGuard implements CanActivate {

  constructor(private userService: CurrentUserService) {}

  public canActivate(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.userService.load()
        .subscribe(
          user => {
            observer.next(true);
            observer.complete();
          },
          error => {
            observer.error(false);
          }
        );
    });
  }
}
