import { Alias, Model } from 'tsmodels';

export class Role extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias('is_admin') public isAdmin: boolean;
  @Alias('is_developer') public isDeveloper: boolean;
}
