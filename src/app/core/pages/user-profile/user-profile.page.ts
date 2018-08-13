import {
  Component, ViewChild, AfterViewChecked,
  AfterViewInit, ChangeDetectorRef, OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import {
  SafeUrl
} from '@angular/platform-browser/src/security/dom_sanitization_service';

import { CurrentUserService } from '../../services/current-user.service';
import { UsersListService } from '../../services/users-list.service';
import { User } from '../../models/user';
import { WaitingComponent } from '../../components';
import { TimeGraphTypes, TimeGraphFilter } from '../../models/timegraph-filter';
import { TimeActivity } from '../../models/time-activity.interface';
import { UserLinksService } from '../../services/user-links.service';
import { SERVICES } from '../../components/user-links/allowed-services';

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
  public isCurrUser = false;
  public filter = new TimeGraphFilter();
  public tgTypes = TimeGraphTypes;
  public activityData: TimeActivity[];
  private modalOptions = new ModalOptions();
  private modalRef: BsModalRef;
  public userLinksData: any;

  constructor(
    public currentUser: CurrentUserService,
    private userListService: UsersListService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private _linksService: UserLinksService,
  ) {
    this.route.params.subscribe(item => {
      this.filter.id = item.id;
    });
  }

  ngOnInit() {
    this.isCurrUser = this.filter.id === this.currentUser.id;
    if (!this.isCurrUser && this.filter.id) {
      this.userListService
      .getUserById(this.filter.id)
      .subscribe(user => this.user = user);
    } else {
      this.user = this.currentUser;
      this.filter.id = this.user.id;
      this.isCurrUser = true;
    }

    const userId = this.isCurrUser ? this.currentUser.id : this.filter.id;
    this._linksService.getUserLinks(userId).subscribe();
    this.userLinksData = this._linksService.userLinksData;

    this.userListService
      .getUserTimeStatsById(this.filter.id)
      .subscribe(data => this.userStats = data);

    this.initModalOptions();
  }

  ngAfterViewInit() {
    this.checkActiveTab();
    this.getIntegrationTime();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  public onChange(file: File): void {
    this.modalRef = this.modalService.show(WaitingComponent, this.modalOptions);

    const subscription = this.currentUser
      .uploadAvatar(file)
      .subscribe();

    this.modalRef.content['imageSubscriptions'] = [
      this.currentUser.avatarSubscription,
      subscription,
    ];
  }

  public checkSelected(source, update): boolean {
    return this.filter.source === source && this.filter.update === update;
  }

  public onIntegrationChange(source, update): void {
    if (this.filter.source === source && this.filter.update === update) {
      this.filter.source = undefined;
      this.filter.update = true;
    } else {
      this.filter.source = source;
      this.filter.update = update;
    }
    this.getIntegrationTime();
  }

  public onTabSelect(tab): void {
    this.changeTabUri(tab);
  }

  public onButtonClick(): void {
    const tab = 'settings';
    this.changeTabUri(tab);
    this.checkActiveTab(tab);
  }

  private checkActiveTab(tab?: string): void {
    if (!tab && !this.route.snapshot.queryParamMap.has('tab')) {
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

  private changeTabUri(tab: string): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab },
    });
  }

  private initModalOptions(): void {
    this.modalOptions.initialState = {
      title: 'Image uploader',
      progressSubject: this.currentUser.progressSubject,
      successMessage: 'Image is successfully uploaded',
    };
    this.modalOptions.keyboard = false;
    this.modalOptions.ignoreBackdropClick = true;
    this.modalOptions.class = 'modal-center';
  }

  private getIntegrationTime(): void {
    this.userListService
      .getIntegrationTime(this.filter)
      .subscribe(data => this.activityData = data);
  }

  public slackUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `slack://user?team=${this.user.slackTeamId}&id=${this.user.slackId}`
    );
  }

  public makeIconClassName(kind: string): string {
    if (SERVICES.includes(kind)) {
      if (kind === 'stackoverflow') {
        return 'fa-stack-overflow';
      } else {
        return `fa-${kind}`;
      }
    } else {
      return 'fa-link';
    }
  }

  get skypeUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `skype:${this.user.skype}?call`
    );
  }
}
