import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { CurrentUserService } from '../../services/current-user.service';

/**
 * This page is necessary by logged in.
 */

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss']
})
export class SignInPage {
  public errors = false;

  constructor(private currentUser: CurrentUserService,
              private router: Router) {
  }

  public signIn(formValue: Object): void {
    this.currentUser
      .signIn(formValue['email'], formValue['password'])
      .subscribe(
        () => {
          this.currentUser.load().subscribe(
            () => {
              if (this.currentUser.registrationFinished) {
                if (localStorage.pathToUpdate) {
                  const parsedPath = JSON.parse(localStorage.pathToUpdate);
                  const pathToUpdate = parsedPath.pathName;
                  const pathToUpdateParams = parsedPath.params.substring(6, 16);

                  this.router.navigate(
                    [pathToUpdate],
                    {
                      queryParams: {
                        date: pathToUpdateParams
                      }
                    }
                  );
                  localStorage.removeItem('pathToUpdate');
                } else {
                  this.router.navigate(['/profile']);
                }
                this.errors = false;
              } else {
                this.router.navigate(['/registration']);
                this.errors = false;
              }
            }
          );
        },
        err => this.errors = true
      );
  }
}
