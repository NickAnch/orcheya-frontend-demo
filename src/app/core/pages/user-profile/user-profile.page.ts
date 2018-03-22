import {
  Component, ViewChild, AfterViewChecked, AfterViewInit, ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';

import { CurrentUserService } from '../../services/current-user.service';
import { UsersListService } from '../../services/users-list.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('tabset')
  public tabset: TabsetComponent;
  public _routeParams: number;
  public user: User;

  constructor(public currentUser: CurrentUserService,
              private _userListService: UsersListService,
              private _route: ActivatedRoute,
              private _cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._routeParams = this._route.snapshot.params['id'];
    if (this._routeParams) {
      this._userListService
        .getUserById(this._routeParams)
        .subscribe(data => this.user = data.user);
    } else {
      this.user = this.currentUser;
    }
  }

  ngAfterViewInit() {
    this._checkActiveTab();
  }

  ngAfterViewChecked() {
    this._cdr.detectChanges();
  }

  private _checkActiveTab() {
    if (!this._route.snapshot.queryParamMap.has('tab')) {
      return;
    }

    const activeTabName = this._route.snapshot.queryParamMap.get('tab');
    const currentTab = this.tabset.tabs
      .find((tab: TabDirective) => tab.id === activeTabName);

    if (currentTab) {
      currentTab.active = true;
    }
  }
}
