import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { CurrentUserService } from '../../core/services/current-user.service';

@Injectable()
export class CanActivateAdminGuard implements CanActivate {
  constructor(private _currentUser: CurrentUserService,
              private _router: Router) {}

  public canActivate(): boolean {
    if (this._currentUser.role.isAdmin) {
      return true;
    } else {
      this._router.navigate(['/']);
      return false;
    }
  }
}
