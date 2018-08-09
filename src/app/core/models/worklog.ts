import { Alias } from 'tsmodels';

export class Worklog {
  @Alias() public date: string;
  @Alias() public task_name: string;
  @Alias() public task_url: string;
}
