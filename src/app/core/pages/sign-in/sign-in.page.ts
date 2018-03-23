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
          this.router.navigate(['/']);
          this.errors = false;
        },
        err => this.errors = true
      );
  }
}
