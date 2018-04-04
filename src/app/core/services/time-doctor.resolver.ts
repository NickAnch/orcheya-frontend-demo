import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/skip';

import { UsersListService } from './users-list.service';
import { CurrentUserService } from './current-user.service';
import { TimeActivity } from '../models/time-activity.interface';

@Injectable()
export class TimeDoctorResolver implements Resolve<void> {
  private userId: number;

  constructor(
    private userListService: UsersListService,
    public currentUser: CurrentUserService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
    const dateTo = new Date();
    const dateFrom = new Date(
      dateTo.getFullYear() - 1, dateTo.getMonth(), dateTo.getDate() - 1
    );

    if (route.paramMap.has('id')) {
      this.userId = +route.paramMap.get('id');
    } else {
      this.userId = this.currentUser.id;
    }

    return new Promise(resolve => {
      this.userListService
        .getTimeActivity(this.userId, dateFrom, dateTo)
        .subscribe(data => {
          this.userListService.timeDoctorTime = data;
          resolve();
        });
    });
  }
}
