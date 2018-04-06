import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { UpdateService, UpdatesResponse } from '../../services/update.service';
import { UpdateFilter } from '../../models/update-filter';
import { Update } from '../../models/update';

@Component({
  selector: 'app-recent-update',
  templateUrl: './recent-update.component.html',
  styleUrls: ['./recent-update.component.scss']
})
export class RecentUpdateComponent implements OnInit {
  @Input()
  private userId: number;
  private updateFilter = new UpdateFilter();
  public lastUpdate: Update;

  constructor(private updateService: UpdateService) {}

  ngOnInit() {
    this.updateFilter.userIds = [String(this.userId)];
    this.updateFilter.limit = String(1);

    this.updateService
      .getUpdates(this.updateFilter)
      .subscribe(data => {
        this.lastUpdate = data.updates.length
          ? data.updates[0] : null;
      });
  }

  public showDate(strDate: string, format: string): string {
    return moment(strDate).format(format);
  }

}
