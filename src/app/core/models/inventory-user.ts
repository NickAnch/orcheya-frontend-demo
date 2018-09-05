import { Alias, Model } from 'tsmodels';

export class InventoryUser extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public surname: string;
}
