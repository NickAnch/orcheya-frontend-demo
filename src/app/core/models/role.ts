import { Alias, Model } from 'tsmodels';

export class Role extends Model {
  @Alias() public id: number;
  @Alias() public name = '';
  @Alias('is_admin') public isAdmin = false;
  @Alias('is_developer') public isDeveloper = false;
  @Alias('is_birthday_notify') public isBirthdayNotify = false;
  @Alias('is_inventory_notify') public isInventoryNotify = false;
  @Alias('user_count') public userCount: number;
}
