import {
  Component, OnInit, ViewChild,
  AfterViewChecked, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';

import { CurrentUserService } from '../../services/current-user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('tabset') public tabset: TabsetComponent;
  public currentUser: User;

  constructor(
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this._currentUserService
      .load()
      .subscribe((user: User) => this.currentUser = user)
    ;
  }

  ngAfterViewInit() {
    this._checkActiveTab();
  }

  ngAfterViewChecked() {
    this._cdr.detectChanges();
  }

  public onUserUpdate(user: User) {
    this.currentUser = user;
  }

  private _checkActiveTab() {
    if (!this._route.snapshot.queryParamMap.has('tab')) {
      return;
    }

    const activeTabName = this._route.snapshot.queryParamMap.get('tab');
    const currentTab = this.tabset.tabs
      .find((tab: TabDirective) => tab.id === activeTabName)
    ;

    if (currentTab) {
      currentTab.active = true;
    }
  }
}

