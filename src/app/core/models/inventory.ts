import { Alias, Model } from 'tsmodels';
import { Moment } from 'moment';
import { GivenInventory } from './given-inventory';

export class Inventory extends Model {
  @Alias() public id: number;
  @Alias() public serial: number;
  @Alias() public title: string;
  @Alias() public life: number;
  @Alias() public price: number;
  @Alias('given', GivenInventory) public given: GivenInventory[];
  @Alias('purchased_at') public purchasedAt: string;
  @Alias('updated_at') public updatedAt: Moment;
  @Alias('created_at') public createdAt: Moment;
}
