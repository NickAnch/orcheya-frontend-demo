import { Component, OnInit } from '@angular/core';
import { ServiceLoadService } from '../../services/service-load.service';
import { ProjectService } from '../../../core/services/project.service';

import {
  Dash, HoursTableRow, ProjectsTableRow
} from '../../models/service-load';

import * as moment from 'moment';
import { Moment } from 'moment';



@Component({
  templateUrl: './service-load.page.html',
  styleUrls: ['./service-load.page.scss']
})
export class ServiceLoadPage implements OnInit {
  private format = 'YYYY-MM-DD';

  public dash: Dash;
  public hoursTable: HoursTableRow[];
  public projectsTable: ProjectsTableRow[];

  public dates: Date[];

  constructor(
    private serviceLoadService: ServiceLoadService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.setWeek();
    this.getServiceLoad();
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
        this.hoursTable = data.hoursTable;
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

  setPaidProject(event, id: number) {
    this.projectService
      .updateProject(id, {paid: event.target.checked})
      .subscribe(() => this.getServiceLoad());
  }
}


