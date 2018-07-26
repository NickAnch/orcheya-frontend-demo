import { Component, OnInit } from '@angular/core';
import { Update } from '../../models/update';
import { NewUpdateService } from '../../services/new-update.service';
import { CurrentUserService } from '../../services/current-user.service';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-new-update',
  templateUrl: './new-update.page.html',
  styleUrls: ['./new-update.page.scss']
})
export class NewUpdatePage implements OnInit {

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
    private newUpdateService: NewUpdateService,
    private activatedRoute: ActivatedRoute,
    private currentUser: CurrentUserService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.updateDate = params['date'];
      this.update.date = this.updateDate;
    });
    this.checkIsUpdateAllowed();
    if (this.isAllowedToSendUpdate) {
      this.newUpdateService.getLastUpdate(this.currentUser.id)
        .subscribe(response => {
          this.promisedToDo = response.prev_update.planning;
          this.doneTodayTasks = response.worked;
        });
    }
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
    this.newUpdateService.sendNewUpdate(this.update)
      .subscribe();
  }
}
