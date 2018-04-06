import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CurrentUserService } from './current-user.service';


@Injectable()
export class RegistrationGuard implements CanActivate {


  constructor(public currentUser: CurrentUserService,
              private router: Router) {

  }

  public canActivate(): Observable<boolean> | boolean {
    this.currentUser.load()
      .subscribe({
        next: () => {
        },
        error: error => console.log(error),
        complete: () => {
          if (this.currentUser.agreementAccepted) {
            if (this.currentUser.registrationFinished) {
              this.router.navigate(['/profile']);
            } else {
              console.log(this.currentUser, 'log');
              return true;
            }
          } else {
            this.router.navigate(['/terms-and-conditions']);
          }
        }
      });
  }
}
