import { Alias, AppModel } from 'tsmodels';
import { User } from './user';

export class Update extends AppModel {
  @Alias() public id: number;
  @Alias() public user: User;
  @Alias() public date: string;
  @Alias() public made: string;
  @Alias() public planning: string;
  @Alias() public issues: string;

  constructor(update?: Object) {
    super();

    if (update) {
      this._fromJSON(update);
    }
  }
}
