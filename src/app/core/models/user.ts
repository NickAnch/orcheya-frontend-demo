import { Alias, AppModel } from 'tsmodels';

export class User extends AppModel {
  @Alias() public id: number;
  @Alias('login') public login: string;
  @Alias('name') public name: string;
  @Alias('email') public email: string;
  @Alias('avatar_url') public avatarUrl?: string;

  public isLoggedIn(): boolean {
    return !!this.id;
  }
}
