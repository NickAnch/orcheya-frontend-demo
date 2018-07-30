import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { CurrentUserService } from '../../services/current-user.service';

/**
 * This's header component.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public currentUser: CurrentUserService,
              private router: Router,
              @Inject(DOCUMENT) public document: Document) {
  }

  public sidebarToggle(): void {
    this.document.body.clientWidth < 768 ?
      this.document.body.classList.toggle('sidebar-open') :
      this.document.body.classList.toggle('sidebar-collapse');
  }

  public signOut(): void {
    this.currentUser
      .signOut()
      .subscribe(() => {
        this.router.navigate(['/sign-in']);
        if (localStorage.pathToUpdate) {
          localStorage.removeItem('pathToUpdate');
        }
      });
  }

  public goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
