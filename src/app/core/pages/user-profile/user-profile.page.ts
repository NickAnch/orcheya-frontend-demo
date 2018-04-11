import {
  Component, ViewChild, AfterViewChecked,
  AfterViewInit, ChangeDetectorRef, OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';

import { CurrentUserService } from '../../services/current-user.service';
import { UsersListService } from '../../services/users-list.service';
import { User } from '../../models/user';

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
  public userStats;
  public isYou = false;

  constructor(public currentUser: CurrentUserService,
              private userListService: UsersListService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit() {
    let userId = +this.route.snapshot.params['id'];
    this.isYou = userId === this.currentUser.id;

    if (!this.isYou && userId) {
      this.userListService
        .getUserById(userId)
        .subscribe(user => this.user = user);
    } else {
      this.user = this.currentUser;
      userId = this.user.id;
      this.isYou = true;
    }

    this.userListService
      .getUserTimeStatsById(userId)
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

  onTabSelect(tab) {
    this.changeTabUri(tab);
  }

  onButtonClick() {
    const tab = 'settings';
    this.changeTabUri(tab);
    this.checkActiveTab(tab);
  }

  private checkActiveTab(tab?: string) {
    if (!tab || !this.route.snapshot.queryParamMap.has('tab')) {
      return;
    }

    const activeTabName = tab
      ? tab : this.route.snapshot.queryParamMap.get('tab');

    const currentTab = this.tabset.tabs
      .find((tabDir: TabDirective) => tabDir.id === activeTabName);

    if (currentTab) {
      currentTab.active = true;
    }
  }

  private changeTabUri(tab: string) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab }
    });
  }
}
