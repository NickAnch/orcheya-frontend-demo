import { Alias, Model } from 'tsmodels';
import { User } from '../../core/models/user';

export class TimesheetFilter extends Model {
  @Alias() public users: User[] = [];
  @Alias() public paid = false;
  @Alias() public dates: Date[];
}
