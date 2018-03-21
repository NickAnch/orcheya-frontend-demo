import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../../services/current-user.service';

/**
 * This page is necessary by logged in.
 */

@Component({
  selector: 'app-accep-invite',
  templateUrl: './accept-invite.page.html',
  styleUrls: ['./accept-invite.page.scss']
})
export class AcceptInvitePage {
  private errors = false;
  private error: string;
  private token: string;

  constructor(private _currentUser: CurrentUserService,
              private _router: Router,
              private _route: ActivatedRoute ) {
    this._route.params.subscribe(params => {
      this.token = params['token'];
    });
  }

  inviteAccept(formValue: Object) {
    this.errors = false;

    if (formValue['password'] !== formValue['password_confirmation']) {
      this.errors = true;
      this.error = 'Passwords do not match';
      return;
    }

    this._currentUser
      .acceptInvite(this.token, formValue['password'])
      .subscribe(
        () => {
          this._router.navigate(['/']);
        },
        error => {
          this.errors = true;
          switch (error.status) {
            case  422:
              this.error = error.error[0];
              break;
            case 406:
              this.error = 'Invite not found';
              console.error('Invite not found:\n' + this.token);
          }
        }
      );
  }
}
