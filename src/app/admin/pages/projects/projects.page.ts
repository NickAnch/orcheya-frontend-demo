import { Component, OnInit } from '@angular/core';

import { Project } from '../../../core/models/project';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-roles',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss']
})
export class ProjectsPage implements OnInit {
  public projects: Project[];

  constructor(
    private _projectService: ProjectService
  ) { }

  ngOnInit() {
    this._projectService
      .getProjectsList()
      .subscribe(x => this.projects = x);
  }

  public setPaidProject(event, id: number): void {
    this._projectService
      .updateProject(id, { paid: event.target.checked })
      .subscribe();
  }
}
