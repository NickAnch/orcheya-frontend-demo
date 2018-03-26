import { Alias, AppModel } from 'tsmodels';
import { Image } from './image';

/**
  This class describe of user model.
*/

export class User extends AppModel {
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
  @Alias() public photo: string;
  @Alias() public timing: string;
  @Alias('employment_at') public employmentAt: string;
  @Alias() public position: string;
  @Alias() public avatar: Image;
  @Alias('slack_connected') public slackConnected: boolean;
}

