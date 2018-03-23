import {
  Component, ViewChild, AfterViewChecked, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';

import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements AfterViewInit, AfterViewChecked {

  @ViewChild('tabset')
  public tabset: TabsetComponent;

  constructor(
    public currentUser: CurrentUserService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

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
      .find((tab: TabDirective) => tab.id === activeTabName)
    ;

    if (currentTab) {
      currentTab.active = true;
    }
  }
}
