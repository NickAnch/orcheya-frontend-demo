import {
  Component, ElementRef, Inject,
  OnInit, Renderer2, ViewChild
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { IMenuGroup } from './menu-group.interface';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sideBar')
  private sideBar: ElementRef;
  private triggerOffset = 50;
  private alreadyScrolled = false;
  public currentGroup: IMenuGroup;

  constructor(
    public sidebarService: SidebarService,
    public renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit() {
    this.handleSidebarAnimation();
  }

  public toggleGroup(group: IMenuGroup): void {
    this.currentGroup = group === this.currentGroup ? null : group;
  }

  private handleSidebarAnimation(): void {
    const elem = this.document.querySelector('.wrapper');
    const sideBar = this.sideBar.nativeElement;

    if (!elem) {
      return;
    }

    this.renderer.listen(elem, 'scroll', (e: Event) => {
      const offset = e.srcElement.scrollTop;

      if (offset > this.triggerOffset && !this.alreadyScrolled) {
        this.renderer.addClass(sideBar, 'scrolled');
        this.alreadyScrolled = true;
      } else if (offset <= this.triggerOffset && this.alreadyScrolled) {
        this.renderer.removeClass(sideBar, 'scrolled');
        this.alreadyScrolled = false;
      }
    });
  }
}
