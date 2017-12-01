import { Component, Inject, Renderer2 } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private _sidebarOpen = true;

  constructor(public currentUser: CurrentUserService,
              private _renderer: Renderer2,
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
}
