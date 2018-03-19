import { Alias, AppModel } from 'tsmodels';

/**
  This class describe of user model.
*/

export class User extends AppModel {
  @Alias() public id: number;
  @Alias() public email: string;
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias() public position: string;
  @Alias() public avatarUrl?: string;
}
