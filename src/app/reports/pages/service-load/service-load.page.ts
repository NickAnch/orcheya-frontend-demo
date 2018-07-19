import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import * as moment from 'moment';
import {
  DurationInputArg1,
  DurationInputArg2
} from 'moment';

import { ServiceLoadService } from '../../services';
import { Dash, UsersTableRow, ProjectsTableRow } from '../../models';

const DATE_FORMAT = 'YYYY-MM-DD';

@Component({
  templateUrl: './service-load.page.html',
  styleUrls: ['./service-load.page.scss']
})
export class ServiceLoadPage implements AfterViewInit {
  public dash: Dash;
  public hoursTable: UsersTableRow[];
  public projectsTable: ProjectsTableRow[];
  private _loadTable: number[];
  private _datesData: string[];

  public count: DurationInputArg1 = 3;
  public kind: DurationInputArg2 = 'month';
  public step = 'week';
  public dates: Date[];
  public chart: Object;
  public chartOptions: Object;

  constructor(
    private serviceLoadService: ServiceLoadService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    this._cdr.detectChanges();
  }

  public changeDates(
    data: { count: DurationInputArg1, kind: DurationInputArg2, dates: Date[]}
  ): void {
    this.kind = data.kind;
    this.count = data.count;
    this.dates = data.dates;
    this.getServiceLoad();
  }

  public beforeGetServiceLoad(): void {
    this.kind = undefined;
    this.count = undefined;
    this.getServiceLoad();
  }

  public getServiceLoad(): void {
    const startDate = moment(this.dates[0]).format(DATE_FORMAT);
    const endDate = moment(this.dates[1]).format(DATE_FORMAT);

    this.serviceLoadService
      .getServiceLoad(startDate, endDate, this.step)
      .subscribe(data => {
        this.dash = data.dash;
        this._datesData = data.datesData;
        this._loadTable = data.loadTable;
        this.hoursTable = data.usersTable;
        this.projectsTable = data.projectsTable;
        this._initGraph();
      });
  }

  public changeStep(step: string): void {
    this.step = step;
    this.getServiceLoad();
  }

  private _initGraph(): void {
    this.chartOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text : 'Graph with dynamic service load'
      },
      legend: {
        enabled: false
      },
      tooltip: {
        shared: true,
        crosshairs: true,
        pointFormat: '{series.name}: <b>{point.y}%</b><br/>'
      },
      yAxis: {
        title: {
          text: 'Percent'
        },
        labels: {
          formatter: function () {
            return this.value + '%';
          }
        }
      },
      xAxis: {
        categories: this._datesData
      },
      series: [{
        name: 'Service load',
        data: this._loadTable
      }]
    };
  }
}
