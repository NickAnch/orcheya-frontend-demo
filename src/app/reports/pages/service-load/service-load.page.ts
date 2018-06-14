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

  public dates: string[] = [
    moment().add(-7, 'days').toString(),
    moment().toString()
  ];

  constructor(
    private serviceLoadService: ServiceLoadService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
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
      moment(startDate).format(this.format),
      moment(endDate).format(this.format)
    ];
    this.onDateChange();
  }

  setDay() {
    this.setDates(moment(), moment());
  }

  setWeek() {
    this.setDates(moment().subtract(1, 'week'), moment());
  }

  setMonth() {
    this.setDates(moment().subtract(1, 'month'), moment());
  }

  setYear() {
    this.setDates(moment().subtract(1, 'year'), moment());
  }

  setPaidProject(event, id: number) {
    this.projectService
      .updateProject(id, {paid: event.target.checked})
      .subscribe(() => this.getServiceLoad());
  }
}


