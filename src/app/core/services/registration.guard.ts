import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
} from '@angular/router';

import { CurrentUserService } from './current-user.service';


@Injectable()
export class RegistrationGuard implements CanActivate {


  constructor(public currentUser: CurrentUserService,
              private router: Router) {

  }

  public canActivate(): Promise<boolean> {

    return new Promise(resolve => {
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
                resolve(true);
              }
            } else {
              this.router.navigate(['/terms-and-conditions']);
            }
          }
        });
    });
  }
}
