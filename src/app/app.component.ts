import { Component, HostListener, Renderer2, OnInit } from '@angular/core';

/**
 * This's main component of application.
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public body = document.querySelector('body');

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const windowWidth = event.target.innerWidth;
    if (windowWidth < 768) {
      this.deleteSidebarCollapse();
    }
  }

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.checkWindowWidth();
  }

  public checkWindowWidth(): void {
    if (window.innerWidth < 768) {
      this.deleteSidebarCollapse();
    }
  }

  public deleteSidebarCollapse(): void {
    this.renderer.removeClass(this.body, 'sidebar-collapse');
  }
}
