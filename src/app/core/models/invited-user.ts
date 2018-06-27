import { Alias, Model } from 'tsmodels';

export class InvitedUser extends Model {
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias() public password: string;
  @Alias('password_confirmation') public passwordConfirmation: string;
  @Alias('invitation_token') public invitationToken: string;
}
