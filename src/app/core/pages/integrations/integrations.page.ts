import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.page.html',
  styleUrls: ['./integrations.page.scss']
})
export class IntegrationsPage implements OnInit {

  constructor(
    public currentUser: CurrentUserService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (
      this.currentUser.slackConnected
      && this.currentUser.timedoctorConnected
    ) {
      this.router.navigate(['/profile']);
    }
  }

}
