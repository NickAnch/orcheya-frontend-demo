import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

import { CurrentUserService } from './current-user.service';

@Injectable()
export class PermissionGuard implements CanActivateChild {


  constructor(private currentUser: CurrentUserService,
              private router: Router) {
  }

  public canActivateChild(): Observable<boolean> {

    return Observable.create((observer: Observer<boolean>) => {

      if (this.currentUser.registrationFinished) {
        observer.next(true);
        observer.complete();
      } else {
        this.router.navigate(['/terms-and-conditions']);
        observer.next(false);
      }
    });
  }
}
