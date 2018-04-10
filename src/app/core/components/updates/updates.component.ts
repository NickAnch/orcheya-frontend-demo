import {
  Component, ElementRef, Input,
  OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromEvent';
import { TreeviewItem } from 'ngx-treeview';
import * as moment from 'moment';

import { UpdateService, UpdatesResponse } from '../../services/update.service';
import { UpdateFilter } from '../../models/update-filter';
import { User } from '../../models/user';
import {
  UsersListResponse, UsersListService
} from '../../services/users-list.service';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})

export class UpdatesComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') private searchInput: ElementRef;
  @Input() public user: User;
  private subscriptions: Subscription[] = [];
  private filter = new UpdateFilter();
  private filterSubject = new Subject<string>();
  private users: User[];
  public data: UpdatesResponse;
  public filterText = '';
  public filterDate: string[];
  public selectedItems: TreeviewItem[] = [];

  constructor(
    private updateService: UpdateService,
    private usersListService: UsersListService,
  ) {}

  ngOnInit() {
    this.selectedItems.push(
      new TreeviewItem({
        text: 'All',
        value: 0,
        checked: !this.user,
      }),
    );

    if (this.user) {
      this.filter.userIds = [String(this.user.id)];
      this.selectedItems.push(
        new TreeviewItem({
          text: this.user.fullName,
          value: this.user.id,
          checked: true,
        }),
      );
    }

    this.fetchData();
    this.initLiveSearching();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      subscription => subscription.unsubscribe()
    );
  }

  onFilterChange(filter: string) {
    if (!filter) {
      return;
    }

    this.filterSubject.next(filter);
  }

  onSelectedChange(ids: number[]) {
    if (!ids.length) {
      return;
    }

    let userIds: string[];
    if (ids.find(id => id === 0) === undefined) {
      userIds = ids.map(id => String(id));
    } else {
      userIds = null;
    }

    this.filter.userIds = userIds;
    this.fetchData();
  }

  public showDate(strDate: string, format: string): string {
    return moment(strDate).format(format);
  }

  public onDateChange() {
    this.filter.startDate = this.filterDate
      ? this.showDate(this.filterDate[0], 'YYYY-MM-DD') : null;

    this.filter.endDate = this.filterDate
      ? this.showDate(this.filterDate[1], 'YYYY-MM-DD') : null;

    this.fetchData();
  }

  private initLiveSearching() {
    this.subscriptions.push(Observable
      .fromEvent(this.searchInput.nativeElement, 'keyup')
      .do(d => this.filter.query = this.filterText)
      .debounceTime(1000)
      .switchMap(() => this.updateService.getUpdates(this.filter))
      .subscribe(data => this.data = data)
    );

    this.subscriptions.push(this.filterSubject
      .debounceTime(500)
      .switchMap(filterText => this.usersListService.getSearch(filterText))
      .subscribe((data: UsersListResponse) => {
        this.users = data.users;
        this.convertUserToItems(this.users);
      })
    );
  }

  private fetchData() {
    this.updateService
      .getUpdates(this.filter)
      .subscribe(data => this.data = data);
  }

  private convertUserToItems(users: User[]) {
    this.selectedItems = users.map(
      user => new TreeviewItem({
        text: user.fullName,
        value: user.id,
        checked: false,
      })
    );
    this.selectedItems.unshift(new TreeviewItem(
      { text: 'All', value: 0, checked: false }
    ));
  }
}
