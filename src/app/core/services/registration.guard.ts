import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CurrentUserService } from './current-user.service';


@Injectable()
export class RegistrationGuard implements CanActivate {

  public finished = true;

  constructor(public currentUser: CurrentUserService,
              private router: Router) {
  }

  public canActivate(): Observable<boolean> | boolean {
    if (this.currentUser.agreementAccepted) {
      if (this.currentUser.registrationFinished) {
        this.router.navigate(['/profile']);
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/terms-and-conditions']);
    }
  }
}
