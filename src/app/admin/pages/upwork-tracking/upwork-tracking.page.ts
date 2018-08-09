import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';

import {
  UpworkTrackingEditComponent, ConfirmModalWorklogComponent
} from '../../modals';
import { WorklogControl } from '../../../core/models/worklog-control';
import { WorklogsControlService } from '../../services/upwork-tracking.service';

@Component({
  selector: 'app-upwork-tracking',
  templateUrl: './upwork-tracking.page.html',
  styleUrls: ['./upwork-tracking.page.scss']
})
export class UpworkTrackingPage implements OnInit {
  public worklogControls: WorklogControl[];
  private sorting = {
    sortBy: '',
    sortOrder: ''
  };

  constructor(private modalService: BsModalService,
              private worklogsControlService: WorklogsControlService) {}

  ngOnInit() {
    this.getWorklogControlsList();
  }

  public getWorklogControlsList(): void {
    this.worklogsControlService
      .getWorklogsControlList()
      .subscribe(response => {
        this.worklogControls = response;
        if (this.worklogControls.length > 1) {
          this.sorting.sortOrder = 'desc';
          this.sortByColumn('fromUser', 'name');
        }
      });
  }

  sortByColumn(columnOne: string, columnTwo?: string): void {
    this.changeSort(columnOne);
    if (this.sorting.sortOrder === 'asc') {
      this.worklogControls.sort((a, b) => {
        if (columnTwo) {
          return this.sortBy(a[columnOne][columnTwo], b[columnOne][columnTwo]);
        } else {
          return this.sortBy(a[columnOne], b[columnOne]);
        }
      });
    } else {
      this.worklogControls.sort((a, b) => {
        if (columnTwo) {
          return this.sortBy(b[columnOne][columnTwo], a[columnOne][columnTwo]);
        } else {
          return this.sortBy(b[columnOne], a[columnOne]);
        }
      });
    }
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

  sortBy(a: string, b: string): number {
    a = a || '';
    b = b || '';

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

  public editWorklogControl(worklogControl?: WorklogControl): void {
    const modal = this.modalService
      .show(UpworkTrackingEditComponent,
            { initialState: { worklogControl: worklogControl || [] }});
    modal.content.onUpdateWorklog
      .subscribe(isUpdate => {
        if (isUpdate) {
          this.getWorklogControlsList();
        }
      });
  }

  startWorklogControl(worklogControl: WorklogControl): void {
    const modal = this.modalService
      .show(ConfirmModalWorklogComponent,
            { class: 'modal-confirmation' });
    modal.content.onUpdateWorklog
      .subscribe(isAccept => {
        if (isAccept) {
          const requestObject = worklogControl.getRequest;
          requestObject.started_at = new Date().toDateString();
          requestObject.ended_at = null;
          requestObject.id = null;
          this.worklogsControlService.addWorklogControl(requestObject)
            .subscribe(
              () => this.getWorklogControlsList(),
              () => alert('error')
            );
        }
      });
  }

  stopWorklogControl(worklogControl: WorklogControl): void {
    const modal = this.modalService
      .show(ConfirmModalWorklogComponent,
            { class: 'modal-confirmation' });
    modal.content.onUpdateWorklog
      .subscribe(isAccept => {
        if (isAccept) {
          const requestObject = worklogControl.getRequest;
          requestObject.ended_at = new Date().toDateString();
          this.worklogsControlService.editWorklogControl(requestObject)
            .subscribe(
              () => this.getWorklogControlsList(),
              () => alert('error')
            );
        }
      });
  }

}
