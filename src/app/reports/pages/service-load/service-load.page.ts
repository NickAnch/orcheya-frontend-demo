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
const colors = ['#fff3f3', '#f3fff3', '#f3f3ff'];

interface PlotBand {
  from: number;
  to: number;
  color: string;
}

@Component({
  templateUrl: './service-load.page.html',
  styleUrls: ['./service-load.page.scss']
})

export class ServiceLoadPage implements AfterViewInit {
  public dash: Dash;
  public hoursTable: UsersTableRow[];
  public projectsTable: ProjectsTableRow[];
  private _loadTable: { percent: number, plan: number, real: number }[];
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

  private _removePlotBand(): void {
    if (this.chart && this.chart['xAxis'] && this.chart['xAxis'][0]) {
      this.chart['xAxis'][0].removePlotBand();
    }
  }

  private _initGraph(): void {
    const max = Math.max(
      ...this._loadTable.map(
        x => Math.round((x.plan / 3600) * 100) / 100
      )
    );
    this._removePlotBand();
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text : 'Graph with dynamic service load'
      },
      legend: {
        enabled: true
      },
      tooltip: {
        shared: true
      },
      yAxis: [{
        visible: false,
        title: {
          text: 'Percent'
        },
        labels: {
          formatter: function () {
            return this.value + '%';
          }
        },
        min: 0,
        max: 100
      }, {
        visible: false,
        title: {
          text: 'Hours'
        },
        labels: {
          formatter: function () {
            return this.value + 'h';
          }
        },
        min: 0,
        max: max,
        endOnTick: false,
        opposite: true
      }],
      xAxis: {
        categories: this._datesData,
        plotBands: this._getPlotBands()
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Load real, %',
        data: this._loadTable.map(x => x.percent),
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}'
        },
        color: 'rgb(124, 181, 236)',
        pointPadding: 0.3,
        pointPlacement: -0.2
      }, {
        name: 'Time plan, h',
        data: this._loadTable.map(x => Math.round((x.plan / 3600) * 100) / 100),
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}'
        },
        color: 'rgba(67, 67, 72, .3)',
        pointPadding: 0.3,
        pointPlacement: 0.2,
        yAxis: 1
      }, {
        name: 'Time real, h',
        data: this._loadTable.map(x => Math.round((x.real / 3600) * 100) / 100),
        dataLabels: {
          enabled: true,
          format: '{point.y:.0f}'
        },
        color: 'rgb(67, 67, 72)',
        pointPadding: 0.3,
        pointPlacement: 0.2,
        yAxis: 1
      }]
    };
  }

  private _getPlotBands(): PlotBand[] {
    let array;

    if (this._datesData.length > 4) {
      if (this.step === 'month') {
        array = this._getPlotBandsForMonth();
      }
      if (this.step === 'week') {
        array = this._getPlotBandsForWeek();
      }
    }

    return array;
  }

  private _getPlotBandsForMonth(): PlotBand[] {
    const array: PlotBand[] = [];
    let i = 0;

    this._datesData.forEach((_, index) => {
      if (index === 0 || index % 3 === 0) {
        array.push({
          from: index - 0.5,
          to: index + 3.5,
          color: colors[i % 3]
        });
        i++;
      }
    });

    return array;
  }

  private _getPlotBandsForWeek(): PlotBand[] {
    const array: PlotBand[] = [];
    let i = 0;
    let start = -0.5;
    let stop;
    let prevMonth;

    this._datesData.forEach((d, index) => {
      const splitMonth = d.split(' - ');
      const fMonth = this._getMonthName(splitMonth[0]);
      const lMonth =  this._getMonthName(splitMonth[1]);
      const similarMonth = fMonth === lMonth;
      const month = similarMonth ? fMonth : lMonth;

      if (index === 0) {
        prevMonth = month;
      }
      if (month !== prevMonth) {
        stop = similarMonth ? index - 0.5 : index;
      }
      if (index === this._datesData.length - 1) {
        stop = index + 0.5;
      }

      prevMonth = month;

      if (stop) {
        array.push({
          from: start,
          to: stop,
          color: colors[i % 3]
        });
        i++;
        start = stop;
        stop = undefined;
      }
    });

    return array;
  }

  private _getMonthName(str: string): string {
    return str.match(/[A-z]+/)[0];
  }
}
