import { Alias, AppModel } from 'tsmodels';

export class User extends AppModel {
  @Alias() public id: number;

  public isLoggedIn(): boolean {
    return !!this.id;
  }
}
