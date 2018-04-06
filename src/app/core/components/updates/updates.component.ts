import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromEvent';
import * as moment from 'moment';

import { UpdateService, UpdatesResponse } from '../../services/update.service';
import { UpdateFilter } from '../../models/update-filter';
import { User } from '../../models/user';
import { UsersListService } from '../../services/users-list.service';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})

export class UpdatesComponent implements OnInit {
  @ViewChild('searchInput') private searchInput: ElementRef;
  @Input() public userId: number;
  private subscription: Subscription;
  private filter = new UpdateFilter();
  public data: UpdatesResponse;
  public filterText = '';
  public filterDate: string[];

  constructor(private updateService: UpdateService) {}

  ngOnInit() {
    if (this.userId) {
      this.filter.userIds = [String(this.userId)];
    }

    this.fetchData();
    this.initLiveSearching();
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = Observable
      .fromEvent(this.searchInput.nativeElement, 'keyup')
      .do(d => this.filter.query = this.filterText)
      .debounceTime(1000)
      .switchMap(() => this.updateService.getUpdates(this.filter))
      .subscribe(data => this.data = data);
  }

  private fetchData() {
    this.updateService
      .getUpdates(this.filter)
      .subscribe(data => this.data = data);
  }
}
