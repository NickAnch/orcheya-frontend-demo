import { Alias, Model } from 'tsmodels';
import { Image } from './image';

/**
  This class describe of user model.
*/

export class User extends Model {
  @Alias() public id: number;
  @Alias() public email: string;
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias() public sex: string;
  @Alias() public birthday: string;
  @Alias() public phone: string;
  @Alias() public skype: string;
  @Alias() public github: string;
  @Alias() public bitbucket: string;
  @Alias() public timing: string;
  @Alias('employment_at') public employmentAt: string;
  @Alias() public role: string;
  @Alias('avatar', Image) public avatar: Image;
  @Alias('slack_connected') public slackConnected: boolean;
  @Alias('timedoctor_connected') public timedoctorConnected: boolean;
  @Alias('agreement_accepted') public agreementAccepted: boolean;
  @Alias('registration_finished') public registrationFinished: boolean;

  constructor(user?) {
    super();

    if (user) {
      this._fromJSON(user);
    }
  }

  get fullName(): string {
    return this.name + ' ' + this.surname;
  }
}

