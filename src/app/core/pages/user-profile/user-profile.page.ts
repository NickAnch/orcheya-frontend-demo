import {
  Component, ViewChild, AfterViewChecked,
  AfterViewInit, ChangeDetectorRef, OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';

import { CurrentUserService } from '../../services/current-user.service';
import { UsersListService } from '../../services/users-list.service';
import { User } from '../../models/user';
import { TimeActivity } from '../../models/time-activity.interface';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit,
  AfterViewInit, AfterViewChecked {

  @ViewChild('tabset')
  public tabset: TabsetComponent;
  public user: User;
  public activityData: Observable<TimeActivity[]>;
  public userStats;

  public previousMonth = moment().subtract(1, 'month').startOf('month').format('MMMM');
  public currentMonth = moment().startOf('month').format('MMMM');
  public weekStartDate = moment().startOf('week').add(1, 'day').format('D MMM');
  public weekEndDate = moment().endOf('week').add(1, 'day').format('D MMM YYYY');
  public isYou = true;


  constructor(public currentUser: CurrentUserService,
              private userListService: UsersListService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    let userId = +this.route.snapshot.params['id'];

    if (userId) {
      this.isYou = false;
      this.currentUser
        .getUserById(userId)
        .subscribe(user => this.user = user);
    } else {
      this.user = this.currentUser;
      userId = this.user.id;
    }

    const id = this.routeParams ? this.routeParams : this.user.id;
    this.fetchActivityData(id);

    this.userListService
      .getUserTimegraphsById(this.routeParams)
      .subscribe(data => this.userStats = data);

  }

  ngAfterViewInit() {
    this.checkActiveTab();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  onChange(file: File) {
    this.currentUser
      .uploadAvatar(file)
      .subscribe();
  }

  private checkActiveTab() {
    if (!this.route.snapshot.queryParamMap.has('tab')) {
      return;
    }

    const activeTabName = this.route.snapshot.queryParamMap.get('tab');
    const currentTab = this.tabset.tabs
      .find((tab: TabDirective) => tab.id === activeTabName);

    if (currentTab) {
      currentTab.active = true;
    }
  }

  private fetchActivityData(id: number) {
    const dateTo = new Date();
    const dateFrom = new Date(
      dateTo.getFullYear() - 1, dateTo.getMonth(), dateTo.getDate() - 1
    );

    this.activityData = this.userListService
      .getTimeActivity(id, dateFrom, dateTo);
  }
}
