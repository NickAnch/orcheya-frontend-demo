import { Alias, AppModel } from 'tsmodels';

/**
  This class describe of user model.
*/

export class User extends AppModel {
  @Alias() public id: number;
  @Alias('email') public email: string;
  @Alias('name') public name: string;
  @Alias('avatar_url') public avatarUrl?: string;
}
