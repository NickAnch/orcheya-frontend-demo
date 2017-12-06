import { Component, Inject, Renderer2 } from '@angular/core';
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
  private _sidebarOpen = true;

  constructor(public currentUser: CurrentUserService,
              private _renderer: Renderer2,
              private _router: Router,
              @Inject(DOCUMENT) public _document: Document) {
  }

  // TODO : Костылек :)
  public sidebarToggle(): void {
    if (this._sidebarOpen) {
      this._renderer.addClass(this._document.body, 'sidebar-collapse');
    } else {
      this._renderer.removeClass(this._document.body, 'sidebar-collapse');
    }

    this._sidebarOpen = !this._sidebarOpen;
  }

  public signOut(): void {
    this.currentUser
      .signOut()
      .subscribe(() => this._router.navigate(['/sign-in']));
  }
}
