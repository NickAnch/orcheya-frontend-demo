import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

import { CurrentUserService } from './current-user.service';

/**
 * This component, which can to give permissions for load another component.
 */

@Injectable()
export class PermissionGuard implements CanActivateChild {


  constructor(private currentUser: CurrentUserService,
              private router: Router) {
    console.log(currentUser);
  }


  public canActivateChild(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.currentUser.load()
        .subscribe({
          next: () => {
          },
          error: error => console.log(error),
          complete: () => {
            if (this.currentUser.registrationFinished) {
              resolve(true);
            } else {
              reject(this.router.navigate(['/terms-and-conditions']));
            }
          }
        });
    });
  }
}
