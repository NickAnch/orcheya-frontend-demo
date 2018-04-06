import { Alias, AppModel } from 'tsmodels';

export class UpdateFilter extends AppModel {
  @Alias() public page?: string;
  @Alias() public limit?: string;
  @Alias() public query?: string;
  @Alias('user_ids') public userIds?: string[];
  @Alias('start_date') public startDate?: string;
  @Alias('end_date') public endDate?: string;

  constructor(data?: Object) {
    super();

    if (data) {
      this._fromJSON(data);
    }
  }
}
