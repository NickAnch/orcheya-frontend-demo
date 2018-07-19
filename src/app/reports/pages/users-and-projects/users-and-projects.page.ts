import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import * as moment from 'moment';
import {
  DurationInputArg1,
  DurationInputArg2
} from 'moment';

import { UsersAndProjectsService } from '../../services';
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
  templateUrl: './users-and-projects.page.html',
  styleUrls: ['./users-and-projects.page.scss']
})

export class UsersAndProjectsPage implements OnInit, AfterViewInit {
  private datesData: string[];
  public usersData: UsersDynamicGraph[];
  public projectsData: ProjectDynamicGraph[];

  public count: DurationInputArg1 = 3;
  public kind: DurationInputArg2 = 'month';
  public dates: Date[];
  public chart: Object;
  public chartOptions: Object;
  public typeOfTime = 'worked';
  public step = 'week';
  public turnOnOff = { usersData: false, projectsData: false };
  public turnOnOffLoading = { usersData: false, projectsData: false };
  private _tabName = 'usersData';
  private _selectedRows: DataFromLocalStorageForDynamicReport;

  constructor(
    private _serviceLoadDynamicService: UsersAndProjectsService,
    private _cdr: ChangeDetectorRef,
) {}

  ngOnInit() {
    this._getLocalStorage();
  }

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
    this.chartOptions = undefined;

    this._serviceLoadDynamicService
      .getServiceLoad(startDate, endDate, this.step)
      .subscribe(data => {
        this.datesData = data.datesData;
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

  private _isArray(obj: Object): boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  private _splat(obj: Object): Object | Object[] {
    return this._isArray(obj) ? obj : [obj];
  }

  private _initGraph(): void {
    dataKeys.forEach((key: string) => {
      this[key].forEach((row, index) => {
        this._setShowFromLocalStr(key, row, index);
      });
    });

    const that = this;

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
        crosshairs: true,
        formatter: function (tooltip) {
          const items = this.points || that._splat(this);
          items.sort(function(a, b) {
            return ((a.y < b.y) ? -1 : ((a.y > b.y) ? 1 : 0));
          });
          items.reverse();
          return tooltip.defaultFormatter.call(this, tooltip);
        }
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

    this[this._tabName].forEach(row => {
      const name = `${row.name} ${row.surname ? ` ${row.surname}` : ''}`;
      this.chartOptions['series'].push({
        name: name,
        data: row[this.typeOfTime].map( x => Math.round(x / 3600 * 100) / 100 ),
        visible: row.show
      });
    });
    this._setLocalStorage();
  }

  private _setShowFromLocalStr(
    field: string, row: UsersDynamicGraph | ProjectDynamicGraph, index: number
  ): void {
    if (this._selectedRows) {
      const find = this._selectedRows[field];
      if (find && find[row.id]) {
        row.show = find[row.id];
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

  public changeStep(step: string): void {
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
