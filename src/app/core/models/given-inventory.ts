import { Alias, Model } from 'tsmodels';
import { Moment } from 'moment';
import { InventoryUser } from './inventory-user';

export class GivenInventory extends Model {
  @Alias() public id: number;
  @Alias('user') public user: InventoryUser;
  @Alias('started_at') public startedAt: Moment;
  @Alias('ended_at') public endedAt: Moment;
}
