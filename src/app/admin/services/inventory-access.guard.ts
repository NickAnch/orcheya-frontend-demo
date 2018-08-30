import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CurrentUserService } from '../../core/services/current-user.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class InventoryAccessGuard implements CanActivate {

  constructor(private _currentUser: CurrentUserService,
              private _router: Router) {}

  public canActivate(): Observable<boolean> {

    return Observable.create((observer: Observer<boolean>) => {
      if (this._currentUser.role.isAdmin &&
          this._currentUser.role.isInventoryNotify) {
        observer.next(true);
        observer.complete();
      } else {
        this._router.navigate(['/']);
        observer.next(false);
        }
    });
  }
}
