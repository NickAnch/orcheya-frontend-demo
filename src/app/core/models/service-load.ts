import { Alias, Model } from 'tsmodels';

export class Dash extends Model {
  @Alias() public workdays: number;
  @Alias() public developers: number;
  @Alias() public other: number;
  @Alias() public hours: number;
  @Alias() public worked_hours: number;
  @Alias() public paid_hours: number;
  @Alias() public total_paid: number;
  @Alias() public active_projects: number;
  @Alias() public paid_projects: number;

  constructor(data: Object) {
    super();
    this._fromJSON(data);
  }
}

export class HoursTableRow extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public worked: number;
  @Alias() public paid: number;
  @Alias() public hours: number;
  @Alias() public payload: number;

  constructor(data: Object) {
    super();
    this._fromJSON(data);
  }
}

export class ProjectsTableRow extends Model {
  @Alias() public name: number;
  @Alias() public hours: string;
  @Alias() public paid: number;

  constructor(data: Object) {
    super();
    this._fromJSON(data);
  }
}
