import { Component, OnInit, OnDestroy } from '@angular/core';
import { Update } from '../../models/update';
import { NewUpdateService } from '../../services/new-update.service';
import { CurrentUserService } from '../../services/current-user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-new-update',
  templateUrl: './new-update.page.html',
  styleUrls: ['./new-update.page.scss']
})
export class NewUpdatePage implements OnInit, OnDestroy {

  private _subsription: ISubscription;
  public promisedToDo: string;
  public doneTodayTasks: Array<object>;
  public isAllowedToSendUpdate: boolean;
  public updateDate: string;

  public update = new Update({
    made: '',
    planning: '',
    issues: '',
  });

  constructor(
    private _newUpdateService: NewUpdateService,
    private _activatedRoute: ActivatedRoute,
    private _currentUser: CurrentUserService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this._subsription = this._activatedRoute.queryParams
      .subscribe((params: Params) => {
        this.updateDate = params['date'];
        this.update.date = this.updateDate;
      });
    this.checkIsUpdateAllowed();
    if (this.isAllowedToSendUpdate) {
      this._newUpdateService.getLastUpdate(this._currentUser.id)
        .subscribe(response => {
          this.promisedToDo = response.prev_update.planning;
          this.doneTodayTasks = response.worked;
        });
    }
  }

  ngOnDestroy() {
    this._subsription.unsubscribe();
  }

  public getTaskName(task: any): string {
    const splittedUrl = task.task_url.split('/');
    return `${splittedUrl[splittedUrl.length - 1]}: ${task.task_name}`;
  }

  public checkIsUpdateAllowed(): void {
    const updateDate = new Date(this.updateDate);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - updateDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 2) {
      this.isAllowedToSendUpdate = false;
    } else {
      this.isAllowedToSendUpdate = true;
    }
  }

  public sendUpdate(): void {
    this._newUpdateService.sendNewUpdate(this.update)
      .subscribe(() => {
        this._router.navigate(['/profile']);
      });
  }
}
