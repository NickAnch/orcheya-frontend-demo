import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  DurationInputArg1,
  DurationInputArg2
} from 'moment';

import { ServiceLoadDynamicService } from '../../services';
import {
  ProjectDynamicGraph,
  UsersDynamicGraph
} from '../../models';

const DATE_FORMAT = 'YYYY-MM-DD';
const reportName = 'serviceLoadDynamic';
const dataKeys = ['usersData', 'projectsData'];

export interface DataFromLocalStorageForDynamicReport {
  usersData?: { id: number; show: boolean; } | {};
  projectsData?: { id: number; show: boolean; } | {};
}

@Component({
  templateUrl: './service-load-dynamic.page.html',
  styleUrls: ['./service-load-dynamic.page.scss']
})

export class ServiceLoadDynamicPage implements OnInit {
  private datesData: string[];
  public loadTable: number[];
  public usersData: UsersDynamicGraph[];
  public projectsData: ProjectDynamicGraph[];

  public dates: Date[];
  public chart: Object;
  public chartOptions: Object;
  public typeOfTime = 'worked';
  public step = 7;
  public turnOnOff = { usersData: false, projectsData: false };
  public turnOnOffLoading = { usersData: false, projectsData: false };
  private _tabName = 'usersData';
  private _selectedRows: DataFromLocalStorageForDynamicReport;

  constructor(
    private _serviceLoadDynamicService: ServiceLoadDynamicService
  ) {}

  ngOnInit() {
    this._getLocalStorage();
    this.setDates(12, 'week');
  }

  public setDates(count: DurationInputArg1, kind: DurationInputArg2): void {
    this.dates = [
      moment().subtract(count, kind).toDate(),
      moment().subtract(1, 'day').toDate()
    ];
    this.getServiceLoad();
  }

  public getServiceLoad(): void {
    const startDate = moment(this.dates[0]).format(DATE_FORMAT);
    const endDate = moment(this.dates[1]).format(DATE_FORMAT);
    this.chartOptions = undefined;

    this._serviceLoadDynamicService
      .getServiceLoad(startDate, endDate, this.step.toString())
      .subscribe(data => {
        this.datesData = data.datesData;
        this.loadTable = data.loadTable;
        this.usersData = data.usersData;
        this.projectsData = data.projectsData;
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

  private _initGraph(): void {
    dataKeys.forEach((key: string) => {
      this[key].forEach((row, index) => {
        this._setShowFromLocalStr(key, row, index);
      });
    });

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

    if (this._tabName === 'loadTable') {
      this._graphWithoutTable();
    } else {
      this._graphWithTable();
    }
    this._setLocalStorage();
  }

  private _graphWithTable(): void {
    this[this._tabName].forEach(row => {
      const name = `${row.name} ${row.surname ? ` ${row.surname}` : ''}`;
      this.chartOptions['series'].push({
        name: name,
        data: row[this.typeOfTime].map( x => Math.round(x / 3600 * 100) / 100 ),
        visible: row.show
      });
    });
  }

  private _graphWithoutTable(): void {
    this.chartOptions['yAxis']['labels'] = {
      formatter: function () {
        return this.value + '%';
      }
    };
    this.chartOptions['tooltip'] = {
      pointFormat: '{series.name}: <b>{point.y}%</b><br/>'
    };
    this.chartOptions['series'].push({
      name: 'Service load',
      data: this[this._tabName]
    });
  }

  private _setShowFromLocalStr(
    field: string, row: UsersDynamicGraph | ProjectDynamicGraph, index: number
  ): void {
    if (this._selectedRows) {
      const find = this._selectedRows[field][row.id];
      if (find) {
        row.show = find;
      } else {
        row.show = false;
      }
    } else {
      row.show = index < 5;
    }
  }

  public changeVisibleRow(
    row: UsersDynamicGraph | ProjectDynamicGraph, i: number, fast?: boolean
  ): void {
    row.show = !row.show;
    const series = this.chart['context']['series'][i];
    if (row.show) {
      series.show();
    } else {
      series.hide();
    }
    if (!fast) {
      this._setLocalStorage();
    }
  }

  public changeTabName(tabName: string): void {
    if (this._tabName === tabName) {
      return;
    }
    this._tabName = tabName;
    this._initGraph();
  }

  public setStep(step: number): void {
    this.step = step;
    this.getServiceLoad();
  }

  public setTurnOnOff(): void {
    if (this.turnOnOffLoading[this._tabName]) {
      return;
    }
    this.turnOnOffLoading[this._tabName] = true;
    setTimeout(() => {
      this.turnOnOff[this._tabName] = !this.turnOnOff[this._tabName];
      this[this._tabName].forEach((row, index) => {
        row.show = !this.turnOnOff[this._tabName];
        this.changeVisibleRow(row, index, true);
      });
      this._setLocalStorage();
      this.turnOnOffLoading[this._tabName] = false;
    }, 0);
  }

  private _graphName(): string {
    return `Graph with ${this.typeOfTime} time`;
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
      usersData: {},
      projectsData: {}
    };
    dataKeys.forEach((key: string) => {
      this[key].forEach(x => {
        data[key][x.id] = x.show;
      });
    });
    this._selectedRows = data;
    if (window && window.localStorage) {
      window.localStorage.setItem(reportName, JSON.stringify(data));
    }
  }
}
