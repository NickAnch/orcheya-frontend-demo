import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../services/current-user.service';

/**
 * This page is necessary by logged in.
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  constructor(private _currentUser: CurrentUserService,
              private _router: Router) {}
  public logIn(): void {
    this._currentUser.id = 1;
    console.log(this._currentUser.isLoggedIn());
    this._router.navigate(['/']);
  }
}
