import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.page.html',
  styleUrls: ['./integrations.page.scss']
})
export class IntegrationsPage  {

  constructor(
    public currentUser: CurrentUserService,
    private router: Router,
  ) {}

  public navigateToProfile() {
    this.router.navigate(['/profile']);
  }

}
