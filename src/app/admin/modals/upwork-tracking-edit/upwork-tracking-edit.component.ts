import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef, TypeaheadMatch, BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';

import { UsersListService } from '../../../core/services/users-list.service';
import { ProjectService } from '../../../core/services/project.service';
import { WorklogsControlService } from '../../services/upwork-tracking.service';

import {
  WorklogControl, IWorklogControlRequest
} from '../../../core/models/worklog-control';
import { UserFilter } from '../../../core/models/user-filter';
import { User } from '../../../core/models/user';
import { Project } from '../../../core/models/project';

import {
  ConfirmModalWorklogComponent
} from '../confirm-modal-worklog/confirm-modal-worklog.component';

@Component({
  selector: 'app-upwork-tracking-edit',
  templateUrl: './upwork-tracking-edit.component.html',
  styleUrls: ['./upwork-tracking-edit.component.scss']
})
export class UpworkTrackingEditComponent implements OnInit {
  public worklogControl: WorklogControl;
  public steps = ['User owner', 'Project', 'User worker'];
  public currentStep = 0;
  public projects: Project[];
  private onUpdateWorklog: EventEmitter<boolean> = new EventEmitter();
  private worklogTransferQuery: IWorklogControlRequest;
  public dataForViewing = {
    userOwnerName: new UserFilter(),
    projectName: null,
    userWorkerName: new UserFilter()
  };

  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private usersListService: UsersListService,
              private projectService: ProjectService,
              private worklogsControlService: WorklogsControlService) {}

  ngOnInit() {
    this.initWorklogDataConfig();
    this.getProjectsList();
  }

  public initWorklogDataConfig(): void {
    if (this.worklogControl && this.worklogControl.id) {
      this.worklogTransferQuery = this.worklogControl.getRequest;
      this.dataForViewing.projectName = this.worklogControl.project.name;
      this.dataForViewing.userOwnerName.search = this
        .worklogControl.fromUser.fullName;
      this.dataForViewing.userWorkerName.search = this
        .worklogControl.toUser.fullName;
    } else {
      this.worklogTransferQuery = {
        id: null,
        from_id: null,
        project_id: null,
        to_id: null,
        started_at: new Date().toDateString(),
        ended_at: null
      };
    }
  }

  get getUserWorkerList(): Observable<User[]> {
    return this.usersListService
      .getUsersList(this.dataForViewing.userWorkerName)
      .map(userResponse => {
        return userResponse.users;
      });
  }

  get getUserOwnerList(): Observable<User[]> {
    return this.usersListService
      .getUsersList(this.dataForViewing.userOwnerName)
      .map(userResponse => {
        return userResponse.users;
      });
  }

  public getProjectsList(): void {
    if (this.worklogTransferQuery.from_id) {
      this.projectService
      .getProjectsListByUserId(this.worklogTransferQuery.from_id)
      .subscribe(projects => {
        this.projects = projects;
      });
    }
  }

  public onChanged(field: string): void {
    switch (field) {
      case 'userOwner':
        this.worklogTransferQuery.from_id = null;
        break;
      case 'project':
        this.worklogTransferQuery.project_id = null;
        break;
      case 'userWorker':
        this.worklogTransferQuery.to_id = null;
        break;
    }
  }

  public onSelectTypeahead(event: TypeaheadMatch, field: string): void {
    const id = event.item.id;
    switch (field) {
      case 'userOwner':
        this.worklogTransferQuery.from_id = id;
        this.getProjectsList();
        break;
      case 'project':
        this.worklogTransferQuery.project_id = id;
        break;
      case 'userWorker':
        this.worklogTransferQuery.to_id = id;
        break;
    }
  }

  get canPrevStep(): boolean {
    return this.currentStep > 0;
  }

  get canNextStep(): boolean {
    return this.currentStep < this.steps.length - 1;
  }

  get canSubmit(): boolean {
    switch (true) {
      case (this.currentStep === 0 && !!this.worklogTransferQuery.from_id):
        return true;
      case (this.currentStep === 1 && !!this.worklogTransferQuery.project_id):
        return true;
      case (this.currentStep === 2 && !!this.worklogTransferQuery.to_id):
        return true;
      default:
        return false;
    }
  }

  public prevStep(): void {
    this.currentStep -= 1;
  }

  public nextStep(): void {
    this.currentStep += 1;
  }

  public checkCurrentStep(numberOfStep: number): boolean {
    return this.currentStep >= numberOfStep;
  }

  public submitWorklogControl() {
    const modal = this.modalService
      .show(ConfirmModalWorklogComponent,
            { initialState: { worklogControlState: this.dataForViewing },
              class: 'modal-confirmation'});
    modal.content.onUpdateWorklog
      .subscribe(isUpdate => {
        if (isUpdate) {
          this.updateOrCreate();
        }
      });
  }

  public updateOrCreate(): void {
    if (this.worklogTransferQuery.id) {
      this.worklogsControlService
        .editWorklogControl(this.worklogTransferQuery)
        .subscribe(() => {
          this.onUpdateWorklog.emit(true);
          this.bsModalRef.hide();
        },
      err => {
        alert(`Error: ${err}`);
      });
    } else {
      this.worklogsControlService
        .addWorklogControl(this.worklogTransferQuery)
        .subscribe(() => {
          this.onUpdateWorklog.emit(true);
          this.bsModalRef.hide();
        },
        err => {
          alert(`Error: ${err}`);
        });
    }
  }
}
