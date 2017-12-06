import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { CurrentUserService } from '../../services/current-user.service';

/**
 * This page is necessary by logged in.
 */

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss']
})
export class SignInPage {

  public email = 'ikasparov.dev@gmail.com';
  public password = 'qweqwe123';

  constructor(private _currentUser: CurrentUserService,
              private _router: Router,
              private _http: HttpClient) {}
  public logIn(): void {
    this._currentUser
      .login(this.email, this.password)
      .subscribe();
  }

  public getSecret(): void {
    // this._currentUser.secret();
  }
}
