import { Alias, Model } from 'tsmodels';
import { User } from './user';
import { RegexpHelper } from '../../shared/helpers/regexp.helper';

export class Update extends Model {
  @Alias() public id: number;
  @Alias('user', User) public user: User;
  @Alias() public date: string;
  @Alias() public made: string;
  @Alias() public planning: string;
  @Alias() public issues: string;

  constructor(update?: Object) {
    super();

    if (update) {
      this._fromJSON(update);
      this.checkLinks();
    }
  }

  private checkLinks() {
    const made = RegexpHelper.matchUrlsForSlack(this.made);
    const planning = RegexpHelper.matchUrlsForSlack(this.planning);
    const issues = RegexpHelper.matchUrlsForSlack(this.issues);

    if (made) {
      this.made = RegexpHelper
        .getReplacedSlackUrls(this.made, made);
    }

    if (planning) {
      this.planning = RegexpHelper
        .getReplacedSlackUrls(this.planning, planning);
    }

    if (issues) {
      this.issues = RegexpHelper
        .getReplacedSlackUrls(this.issues, issues);
    }
  }
}
