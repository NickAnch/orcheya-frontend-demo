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
  public tooltipMessages = {
    edit: 'This action will create new worklog transfer with new data',
    start: 'This action will create a new worklog transfer with this data',
    stop: 'This action will stop worklog transfer'
  };
  private sorting = {
    sortBy: '',
    sortOrder: ''
  };

  constructor(private modalService: BsModalService,
              private worklogsControlService: WorklogsControlService) {}

  ngOnInit() {
    this.getWorklogControlList();
  }

  private getWorklogControlList(): void {
    this.worklogsControlService
      .getWorklogsControlList()
      .subscribe(response => {
        this.worklogControls = response;
      });
  }

  public sortByColumn(columnOne: string, columnTwo?: string): void {
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

  private changeSort(column: string): void {
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

  private sortBy(a: string, b: string): number {
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

  public isSortingColumn(sortBy: string, sortOrder?: string): boolean {
    return !sortOrder && this.sorting.sortBy === sortBy ||
           sortOrder && this.sorting.sortBy === sortBy &&
           this.sorting.sortOrder === sortOrder;
  }

  public editWorklogControl(worklogControl?: WorklogControl): void {
    const modal = this.modalService
      .show(UpworkTrackingEditComponent,
            { initialState: { worklogControl: worklogControl || [] },
              class: 'modal-center modal-simple'});
    modal.content.onUpdateWorklog
      .subscribe(isUpdate => {
        if (isUpdate) {
          this.getWorklogControlList();
        }
      });
  }

  public startWorklogControl(worklogControl: WorklogControl): void {
    const modal = this.modalService
      .show(ConfirmModalWorklogComponent,
            { class: 'modal-center modal-confirmation' });
    modal.content.onUpdateWorklog
      .subscribe(isAccept => {
        if (isAccept) {
          const requestObject = worklogControl.getRequest;
          requestObject.started_at = new Date().toDateString();
          requestObject.ended_at = null;
          requestObject.id = null;
          this.worklogsControlService.addWorklogControl(requestObject)
            .subscribe(
              () => this.getWorklogControlList(),
              () => alert('error')
            );
        }
      });
  }

  public stopWorklogControl(worklogControl: WorklogControl): void {
    const modal = this.modalService
      .show(ConfirmModalWorklogComponent,
            { class: 'modal-center modal-confirmation' });
    modal.content.onUpdateWorklog
      .subscribe(isAccept => {
        if (isAccept) {
          const requestObject = worklogControl.getRequest;
          let date = new Date();
          if (date < new Date(requestObject.started_at)) {
            date = new Date(requestObject.started_at);
          }
          requestObject.ended_at = date.toDateString();
          this.worklogsControlService.editWorklogControl(requestObject)
            .subscribe(
              () => this.getWorklogControlList(),
              () => alert('error')
            );
        }
      });
  }

}
