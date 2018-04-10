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
            () => null,
            () => null,
            () => {
              if (this.currentUser.registrationFinished) {
                this.router.navigate(['/profile']);
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
