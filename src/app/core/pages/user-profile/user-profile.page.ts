import {
  Component, ViewChild, AfterViewChecked,
  AfterViewInit, ChangeDetectorRef, OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';

import { CurrentUserService } from '../../services/current-user.service';
import { UsersListService } from '../../services/users-list.service';
import { User } from '../../models/user';
import {
  WaitingComponent
} from '../../components/modals/waiting/waiting.component';

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
  private modalOptions = new ModalOptions();
  private modalRef: BsModalRef;

  constructor(
    public currentUser: CurrentUserService,
    private userListService: UsersListService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
  ) {}

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

    this.initModalOptions();
  }

  ngAfterViewInit() {
    this.checkActiveTab();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  onChange(file: File) {
    this.modalRef = this.modalService.show(WaitingComponent, this.modalOptions);

    const subscription = this.currentUser
      .uploadAvatar(file)
      .subscribe();

    this.modalRef.content['imageSubscriptions'] = [
      this.currentUser.avatarSubscription,
      subscription,
    ];
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

  private changeTabUri(tab: string) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab }
    });
  }

  private initModalOptions() {
    this.modalOptions.initialState = {
      title: 'Image uploader',
      progressSubject: this.currentUser.progressSubject,
      successMessage: 'Image is successfully uploaded',
    };
    this.modalOptions.keyboard = false;
    this.modalOptions.ignoreBackdropClick = true;
    this.modalOptions.class = 'modal-center';
  }
}
