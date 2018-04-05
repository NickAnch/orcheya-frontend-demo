import { Component } from '@angular/core';

import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  constructor(public currentUser: CurrentUserService) {}
}
