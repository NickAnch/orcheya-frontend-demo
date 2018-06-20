import { Alias, Model } from 'tsmodels';

/**
 This class describe of user model.
 */
export class Timing extends Model {
  @Alias() public id: number;
  @Alias() public time: string;
}
