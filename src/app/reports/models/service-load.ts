import { Alias, Model } from 'tsmodels';

export class Dash extends Model {
  @Alias() public workdays: number;
  @Alias() public developers: number;
  @Alias() public other: number;
  @Alias() public hours: number;
  @Alias('worked_hours') public workedHours: number;
  @Alias('paid_hours') public paidHours: number;
  @Alias('total_paid') public totalPaid: number;
  @Alias('active_projects') public activeProjects: number;
  @Alias('paid_projects') public paidProjects: number;
}

export class HoursTableRow extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias() public worked: number;
  @Alias() public paid: number;
  @Alias() public hours: number;
  @Alias() public load: number;
}

export class ProjectsTableRow extends Model {
  @Alias() public id: number;
  @Alias() public name: number;
  @Alias() public hours: string;
  @Alias() public paid: number;
}
