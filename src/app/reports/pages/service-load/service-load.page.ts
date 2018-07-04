import { Component, OnInit } from '@angular/core';
import { ServiceLoadService } from '../../services/service-load.service';

import {
  Dash, UsersTableRow, ProjectsTableRow
} from '../../models';

import * as moment from 'moment';
import { Moment } from 'moment';



@Component({
  templateUrl: './service-load.page.html',
  styleUrls: ['./service-load.page.scss']
})
export class ServiceLoadPage implements OnInit {
  private format = 'YYYY-MM-DD';

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

  onDateChange() {
    this.getServiceLoad();
  }

  getServiceLoad() {
    const startDate = moment(this.dates[0]).format(this.format);
    const endDate = moment(this.dates[1]).format(this.format);

    this.serviceLoadService
      .getServiceLoad(startDate, endDate)
      .subscribe(data => {
        this.dash = data.dash;
        this.hoursTable = data.usersTable;
        this.projectsTable = data.projectsTable;
      });
  }

  setDates(startDate: Moment, endDate: Moment) {
    this.dates = [
      moment(startDate).toDate(),
      moment(endDate).toDate()
    ];
    this.onDateChange();
  }

  setDay() {
    this.setDates(moment().subtract(1, 'day'), moment().subtract(1, 'day'));
  }

  setWeek() {
    this.setDates(moment().subtract(1, 'week'), moment().subtract(1, 'day'));
  }

  setMonth() {
    this.setDates(moment().subtract(1, 'month'), moment().subtract(1, 'day'));
  }

  setYear() {
    this.setDates(moment().subtract(1, 'year'), moment().subtract(1, 'day'));
  }
}


