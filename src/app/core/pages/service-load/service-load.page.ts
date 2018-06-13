import { Component, OnInit } from '@angular/core';
import { ServiceLoadService } from '../../services/service-load.service';

import {
  Dash, HoursTableRow, ProjectsTableRow
} from '../../models/service-load';
import * as moment from 'moment';

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

  constructor(private serviceLoadService: ServiceLoadService ) {}

  ngOnInit() {
    this.getServiceLoad(this.dates);
  }

  onDateChange() {
    this.getServiceLoad(this.dates);
  }

  getServiceLoad(dates: string[]) {
    const startDate = moment(dates[0]).format(this.format);
    const endDate = moment(dates[1]).format(this.format);

    this.serviceLoadService
      .getServiceLoad(startDate, endDate)
      .subscribe(data => {
        this.dash = data.dash;
        this.hoursTable = data.hoursTable;
        this.projectsTable = data.projectsTable;
      });
  }


}
