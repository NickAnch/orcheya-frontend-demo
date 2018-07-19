import { Alias, Model } from 'tsmodels';
import { Moment } from 'moment';

/**
 This class describe of user model.
 */
export class Notification extends Model {
  @Alias() public id: number;
  @Alias() public text: number;
  @Alias() public importance: number;
  @Alias() public readed_at: Moment;
  @Alias() public created_at: Moment;
}
