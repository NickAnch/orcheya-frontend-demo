import { Alias, Model } from 'tsmodels';
import { Worklog } from './worklog';

export class TimesheetRow extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias('all_worklogs') public allWorklogs: Worklog[];
  @Alias('paid_worklogs') public paidWorklogs: Worklog[];

  public time(paid: boolean): number {
    const worklogs = paid ? this.paidWorklogs : this.allWorklogs;

    return worklogs
      .map(e => e.time)
      .reduce((acc, time) => acc + time, 0);
  }
}
