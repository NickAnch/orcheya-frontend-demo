import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CurrentUserService } from './current-user.service';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class PermissionGuard implements CanActivate {


  constructor(private currentUser: CurrentUserService,
              private router: Router) {
  }

  public canActivate(): Observable<boolean> | boolean {

    return Observable.create((observer: Observer<boolean>) => {

      this.currentUser.load()
        .subscribe(
          () => null,
          () => null,
          () => {
            if (this.currentUser.registrationFinished) {
              observer.next(true);
              observer.complete();
            } else {
              this.router.navigate(['/sign-in']);
              observer.next(false);
            }
          }
        );
    });
  }
}
