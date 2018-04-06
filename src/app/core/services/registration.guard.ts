import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CurrentUserService } from './current-user.service';

@Injectable()
export class RegistrationGuard implements CanActivate {

  constructor(public currentUser: CurrentUserService,
              private router: Router) {
  }

  public canActivate(): Observable<boolean> {

    return Observable.create((observer: Observer<boolean>) => {
      if (this.currentUser.agreementAccepted) {
        if (this.currentUser.registrationFinished) {
          this.router.navigate(['/profile']);
          observer.next(false);
        } else {
          observer.next(true);
          observer.complete();
        }
      } else {
        this.router.navigate(['/terms-and-conditions']);
        observer.next(false);
      }
    });
  }
}
