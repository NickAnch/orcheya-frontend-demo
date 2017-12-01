import { Alias, AppModel } from 'tsmodels';

/**
  This class describe of user model.
*/

export class User extends AppModel {
  @Alias() public id: number;
  @Alias('login') public login: string;
  @Alias('name') public name: string;
  @Alias('email') public email: string;
  @Alias('avatar_url') public avatarUrl?: string;

 /**
 * @returns Is user loggined in.
 */
  public isLoggedIn(): boolean {
    return !!this.id;
  }
}
