import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../../services/current-user.service';
import { InvitedUser } from '../../models/invited-user';
import { TimingsService } from '../../services/timings.service';


/**
 * This page is necessary by logged in.
 */
@Component({
  selector: 'app-accep-invite',
  templateUrl: './accept-invite.page.html',
  styleUrls: ['./accept-invite.page.scss']
})
export class AcceptInvitePage {
  public errors = {};
  public user: InvitedUser = new InvitedUser();

  constructor(private currentUser: CurrentUserService,
              private _timingsService: TimingsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route
      .params
      .subscribe(params => this.user.invitationToken = params['token']);
  }

  public inviteAccept(formValue: Object) {
    this.errors = {};

    if (formValue['password'] !== formValue['password_confirmation']) {
      this.errors['password_confirmation'] = ['Passwords doesn\'t match'];
      return;
    }

    this.currentUser
      .acceptInvite(this.user)
      .subscribe(
        () => this.router.navigate([`/terms-and-conditions`]),
        errors => this.errors = errors
      );
  }
}
