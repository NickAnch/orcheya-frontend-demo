import { Alias, Model } from 'tsmodels';
import * as moment from 'moment';
import { Moment } from 'moment';

/**
 This class describe of user model.
 */
export class Timing extends Model {
  @Alias() public id: number;
  @Alias() public start: Moment;
  @Alias() public end: Moment;
  @Alias('flexible') public isFlexible: boolean;
  @Alias('users_count') usersCount: number;

  static build(from: Moment, to: Moment) {
    const timing = new Timing();
    timing.start = from;
    timing.end = to;
    return timing;
  }

  get time() {
    if (this.isFlexible) {
      return `flexible`;
    } else {
      const start = moment(this.start).format('HH:mm');
      const end = moment(this.end).format('HH:mm');
      return `${start} - ${end}`;
    }
  }
}
