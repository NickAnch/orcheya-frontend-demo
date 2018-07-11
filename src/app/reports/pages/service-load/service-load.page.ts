import { Component, OnInit } from '@angular/core';
import { ServiceLoadService } from '../../services';

import { Dash, UsersTableRow, ProjectsTableRow } from '../../models';

import * as moment from 'moment';
import { Moment } from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

@Component({
  templateUrl: './service-load.page.html',
  styleUrls: ['./service-load.page.scss']
})
export class ServiceLoadPage implements OnInit {

  public dash: Dash;
  public hoursTable: UsersTableRow[];
  public projectsTable: ProjectsTableRow[];

  public dates: Date[];

  constructor(
    private serviceLoadService: ServiceLoadService
  ) {}

  ngOnInit() {
    this.setWeek();
  }

  public onDateChange(): void {
    this.getServiceLoad();
  }

  public getServiceLoad(): void {
    const startDate = moment(this.dates[0]).format(DATE_FORMAT);
    const endDate = moment(this.dates[1]).format(DATE_FORMAT);

    this.serviceLoadService
      .getServiceLoad(startDate, endDate)
      .subscribe(data => {
        this.dash = data.dash;
        this.hoursTable = data.usersTable;
        this.projectsTable = data.projectsTable;
      });
  }

  public setDates(startDate: Moment, endDate: Moment): void {
    this.dates = [
      moment(startDate).toDate(),
      moment(endDate).toDate()
    ];
    this.onDateChange();
  }

  public setDay(): void {
    this.setDates(
      moment().subtract(1, 'day'),
      moment().subtract(1, 'day')
    );
  }

  public setWeek(): void {
    this.setDates(
      moment().subtract(1, 'week'),
      moment().subtract(1, 'day')
    );
  }

  public setMonth(): void {
    this.setDates(
      moment().subtract(1, 'month'),
      moment().subtract(1, 'day')
    );
  }

  public setYear(): void {
    this.setDates(
      moment().subtract(1, 'year'),
      moment().subtract(1, 'day')
    );
  }
}
