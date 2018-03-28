import {
  Component, ViewChild, AfterViewChecked, AfterViewInit, ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';

import { CurrentUserService } from '../../services/current-user.service';
import { UsersListService } from '../../services/users-list.service';
import { User } from '../../models/user';
import { TimeActivity } from '../../models/time-activity.interface';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit,
                                        AfterViewInit, AfterViewChecked {

  @ViewChild('tabset')
  public tabset: TabsetComponent;
  public routeParams: number;
  public user: User;
  public activityData: Observable<TimeActivity[]>;

  constructor(public currentUser: CurrentUserService,
              private userListService: UsersListService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.routeParams = +this.route.snapshot.params['id'];
    if (this.routeParams) {
      this.userListService
          .getUserById(this.routeParams)
          .subscribe(user => this.user = user);
    } else {
      this.user = this.currentUser;
    }

    const id = this.routeParams ? this.routeParams : this.user.id;
    this.fetchActivityData(id);
  }

  ngAfterViewInit() {
    this.checkActiveTab();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
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
