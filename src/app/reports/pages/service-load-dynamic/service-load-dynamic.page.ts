import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

import { ServiceLoadDynamicService } from '../../services';
import { UsersDynamicGraph } from '../../models';

const DATE_FORMAT = 'YYYY-MM-DD';
const reportName = 'serviceLoadDynamic';

export interface DataFromLocalStorageForDynamicReport {
  usersData?: {
    id: number;
    show: boolean;
  } | {};
}

@Component({
  templateUrl: './service-load-dynamic.page.html',
  styleUrls: ['./service-load-dynamic.page.scss']
})

export class ServiceLoadDynamicPage implements OnInit {
  private datesData: [string];
  public usersData: UsersDynamicGraph[];

  public dates: Date[];
  public chart: Object;
  public chartOptions: Object;
  public typeOfTime = 'worked';
  public step: number;
  private _tabName = 'usersData';
  private _selectedRows: DataFromLocalStorageForDynamicReport;

  constructor(
    private _serviceLoadDynamicService: ServiceLoadDynamicService
  ) {}

  ngOnInit() {
    this._getLocalStorage();
    this.setWeek();
  }

  public getServiceLoad(): void {
    const startDate = moment(this.dates[0]).format(DATE_FORMAT);
    const endDate = moment(this.dates[1]).format(DATE_FORMAT);
    this.chartOptions = undefined;

    this._serviceLoadDynamicService
      .getServiceLoad(startDate, endDate, this.step.toString())
      .subscribe(data => {
        this.datesData = data.datesData;
        this.usersData = data.usersData;
        this._initGraph();
      });
  }

  public onChangeTypeOfTime(): void {
    if (this.typeOfTime === 'worked') {
      this.typeOfTime = 'paid';
    } else {
      this.typeOfTime = 'worked';
    }
    this._initGraph();
  }

  private _graphName(): string {
    return `Graph with ${this.typeOfTime} time`;
  }

  private _initGraph(): void {
    this.chartOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text : this._graphName()
      },
      legend: {
        enabled: false
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      yAxis: {
        title: {
          text: 'Hours'
        }
      },
      xAxis: {
        categories: this.datesData
      },
      series: []
    };
    this[this._tabName].forEach((row, index) => {
      this._setShowFromLocalStr(row, index);
      this.chartOptions['series'].push({
        name: `${row.name} ${row.surname}`,
        data: row[this.typeOfTime].map( x => Math.round(x / 3600 * 100) / 100 ),
        visible: row.show
      });
    });
    this._setLocalStorage();
  }

  private _setShowFromLocalStr(row: UsersDynamicGraph, index: number): void {
    if (this._selectedRows) {
      const find = this._selectedRows.usersData[row.id];
      if (find) {
        row.show = find;
      } else {
        row.show = false;
      }
    } else {
      row.show = index < 5;
    }
  }

  public changeVisibleRow(row: UsersDynamicGraph, i: number): void {
    row.show = !row.show;
    const series = this.chart['context']['series'][i];
    if (row.show) {
      series.show();
    } else {
      series.hide();
    }
    this._setLocalStorage();
  }

  public changeTabName(tabName: string): void {
    if (this._tabName === tabName) {
      return;
    }
    this._tabName = tabName;
    this._initGraph();
  }

  public setDates(startDate: Moment, endDate: Moment): void {
    this.dates = [
      moment(startDate).toDate(),
      moment(endDate).toDate()
    ];
    this.getServiceLoad();
  }

  public setDay(): void {
    this.step = 1;
    this.setDates(
      moment().subtract(10, 'day'),
      moment().subtract(1, 'day')
    );
  }

  public setWeek(): void {
    this.step = 7;
    this.setDates(
      moment().subtract(10, 'week'),
      moment().subtract(1, 'day')
    );
  }

  public setMonth(): void {
    this.step = 30;
    this.setDates(
      moment().subtract(10, 'month'),
      moment().subtract(1, 'day')
    );
  }

  public setYear(): void {
    this.step = 365;
    this.setDates(
      moment().subtract(10, 'year'),
      moment().subtract(1, 'day')
    );
  }

  private _getLocalStorage() {
    if (window && window.localStorage) {
      this._selectedRows = JSON.parse(
        window.localStorage.getItem(reportName)
      );
    }
  }

  private _setLocalStorage() {
    const data: DataFromLocalStorageForDynamicReport = {
      usersData: {}
    };
    this.usersData.forEach(x => {
      data.usersData[x.id] = x.show;
    });
    this._selectedRows = data;
    if (window && window.localStorage) {
      window.localStorage.setItem(reportName, JSON.stringify(data));
    }
  }
}
