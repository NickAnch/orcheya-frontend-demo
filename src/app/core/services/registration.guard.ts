import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CurrentUserService } from './current-user.service';
import { User } from '../models/user';


@Injectable()
export class RegistrationGuard implements CanActivate {

  public user: User;

  constructor(public currentUser: CurrentUserService,
              private router: Router) {
    this.user = this.currentUser;
  }

  public canActivate(): Observable<boolean> | boolean {
    if (this.user.agreementAccepted) {
      return true;
    } else {
      this.router.navigate(['/terms-and-conditions']);
    }
  }
}
