import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';

/**
 * This's header.
 */

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public currentUser: CurrentUserService) { }

  ngOnInit() {
  }

}
