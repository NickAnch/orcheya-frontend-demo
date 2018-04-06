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

    return new Promise((resolve, reject) => {
      this.currentUser.load()
        .subscribe({
          next: () => {
          },
          error: error => console.log(error),
          complete: () => {
            if (this.currentUser.agreementAccepted) {
              if (this.currentUser.registrationFinished) {
                reject(this.router.navigate(['/profile']));
              } else {
                resolve(true);
              }
            } else {
              reject(this.router.navigate(['/terms-and-conditions']));
            }
          }
        });
    });
  }
}
