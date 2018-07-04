import { Alias, Model } from 'tsmodels';
import * as moment from 'moment';

/**
 This class describe of user model.
 */
export class Timing extends Model {
  @Alias() public id: number;
  @Alias() public start: Date;
  @Alias() public end: Date;
  @Alias('flexible') public isFlexible: boolean;

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
