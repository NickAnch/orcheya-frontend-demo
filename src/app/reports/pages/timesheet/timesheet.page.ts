import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '../../services';

import * as moment from 'moment';
import { Moment } from 'moment';

import { User } from '../../../core/models/user';
import {
  UsersListResponse, UsersListService
} from '../../../core/services/users-list.service';

import { TimesheetFilter, TimesheetRow } from '../../models';
import { Role } from '../../../core/models/role';
import {
  RolesService,
} from '../../../core/services/roles.service';

@Component({
  templateUrl: './timesheet.page.html',
  styleUrls: ['./timesheet.page.scss']
})
export class TimesheetPage implements OnInit {
  public timesheetRows: TimesheetRow[];

  public users: User[];
  public roles: Role[];
  public paid: boolean;

  public today = moment();
  public days: Moment[];
  private filter = new TimesheetFilter();

  private getTimesheetDelay;

  private sorting = {
    sortBy: '',
    sortOrder: ''
  };

  constructor(
    private timesheetService: TimesheetService,
    private usersListService: UsersListService,
    private rolesService: RolesService,
  ) {}

  ngOnInit() {
    this.filter.paid = false;

    this.setWeek();
    this.fetchUsers();
    this.fetchRoles();
  }

  getTimesheet() {
    this.timesheetService.getTimesheet(this.filter)
      .subscribe(data => {
        this.timesheetRows = data.timesheetRows;
        this.days = this.daysRange();
        this.sorting.sortBy = '';
      });
  }

  changeSort(column: string): void {
    if (column === this.sorting.sortBy) {
      if (this.sorting.sortOrder === 'asc') {
        this.sorting.sortOrder = 'desc';
      } else {
        this.sorting.sortOrder = 'asc';
      }
    } else {
      this.sorting.sortBy = column;
      this.sorting.sortOrder = 'asc';
    }
  }

  changeSortByCountTime() {
    this.changeSort('countTime');
    if (this.sorting.sortOrder === 'asc') {
      this.timesheetRows
        .sort((a, b) => {
          const sortTime = this.sortBy(a.time(this.paid), b.time(this.paid));
          return sortTime !== 0 && sortTime ||
                 this.sortBy(a.surname, b.surname);
        });
    } else {
      this.timesheetRows
        .sort((a, b) => {
          const sortTime = this.sortBy(b.time(this.paid), a.time(this.paid));
          return sortTime !== 0 && sortTime ||
                 this.sortBy(a.surname, b.surname);
        });
    }
  }

  changeSortByDate(day: Moment) {
    this.changeSort(day.toString());

    if (this.sorting.sortOrder === 'asc') {
      this.timesheetRows
        .sort((a, b) => {
          const sortTime = this.sortBy(this.findTime(a, day, this.paid),
                                       this.findTime(b, day, this.paid));
          return sortTime !== 0 && sortTime ||
                 this.sortBy(a.surname, b.surname);
        });
    } else {
      this.timesheetRows
        .sort((a, b) => {
          const sortTime = this.sortBy(this.findTime(b, day, this.paid),
                                       this.findTime(a, day, this.paid));
          return sortTime !== 0 && sortTime ||
                 this.sortBy(a.surname, b.surname);
        });
    }
  }

  sortByColumn(column: string): void {
    this.changeSort(column);
    if (this.sorting.sortOrder === 'asc') {
      this.timesheetRows.sort((a, b) => this.sortBy(a[column], b[column]));
    } else {
      this.timesheetRows.sort((a, b) => this.sortBy(b[column], a[column]));
    }
  }

  sortBy(a: string | number, b: string | number): number {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }

  isSortingColumn(sortBy: string, sortOrder?: string): boolean {
    return !sortOrder && this.sorting.sortBy === sortBy ||
           sortOrder && this.sorting.sortBy === sortBy &&
           this.sorting.sortOrder === sortOrder;
  }

  daysRange() {
    const first = moment(this.filter.dates[0]);
    const last = moment(this.filter.dates[1]);
    const res = [];

    for (let i = 0; i <= last.diff(first, 'days'); i++) {
      res.push(first.clone().add(i, 'day'));
    }

    return res;
  }

  findTime(user, day, paid) {
    const worklogs = paid ? user.paidWorklogs : user.allWorklogs;
    const worklog = worklogs.find(
      e => moment(e.date).isSame(moment(day), 'day')
    );

    return worklog ? worklog.time : 0;
  }

  findTimeByDay(day, paid) {
    return this.timesheetRows
      .map(
        e => this.findTime(e, day, paid)
      ).reduce(
        (acc, e) => acc += e,
        0
      );
  }

  get totalTime() {
    return this.timesheetRows
      .map(
        e => e.time(this.paid)
      ).reduce(
        (acc, e) => acc += e,
        0
      );
  }

  setDates(startDate: Moment, endDate: Moment) {
    this.filter.dates = [
      moment(startDate).toDate(),
      moment(endDate).toDate()
    ];
  }

  setWeek() {
    this.setDates(
      moment().startOf('isoWeek'),
      moment().endOf('isoWeek')
    );
  }

  private fetchUsers() {
    this.usersListService.getUsersList()
      .subscribe((data: UsersListResponse) => {
        this.users = data.users;
      });
  }

  fetchRoles() {
    this.rolesService.getList()
      .subscribe(roles => this.roles = roles);
  }

  filterChanged() {
    clearTimeout(this.getTimesheetDelay);
    this.getTimesheetDelay = setTimeout(
      () => this.getTimesheet(),
      10
    );
  }

  scrollbarWidth(user, day, paid) {
    const eightHours = 28800;
    const width = this.findTime(user, day, paid) * 100 / eightHours;
    return width > eightHours ? eightHours : width;
  }

  totalScrollbarWidth(day, paid) {
    const eightHours = 28800 * this.timesheetRows.length;
    const width = this.findTimeByDay(day, paid) * 100 / eightHours;
    return width > eightHours ? eightHours : width;
  }
}


