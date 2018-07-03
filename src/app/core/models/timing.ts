import { Alias, Model } from 'tsmodels';

/**
 This class describe of user model.
 */
export class Timing extends Model {
  @Alias() public id: number;
  @Alias() public time: string;
  @Alias('users_count') usersCount: number;

  public static newPair(begin: string, end: string): Timing {
    const obj = new Timing();
    obj.time = `${begin} - ${end}`;
    return obj;
  }
}
