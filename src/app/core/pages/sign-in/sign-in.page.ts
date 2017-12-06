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
  private errors: boolean = false;

  constructor(private _currentUser: CurrentUserService,
              private _router: Router) {
  }

  public signIn(formValue: Object): void {
    this._currentUser
      .signIn(formValue['email'], formValue['password'])
      .subscribe(
        () => {
          this._router.navigate(['/']);
          this.errors = false;
        },
        err => this.errors = true
      );
  }
}
