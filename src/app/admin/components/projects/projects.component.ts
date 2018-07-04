import { Component, OnInit } from '@angular/core';

import { Project } from '../../../core/models/project';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  public projects: Project[];

  constructor(
    private _projectService: ProjectService
  ) { }

  ngOnInit() {
    this._projectService
      .getProjectsList()
      .subscribe(projects => {
        this.projects = projects.sort((a: Project, b: Project) => {
          return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
        });
      });
  }

  public setPaidProject(event, id: number): void {
    this._projectService
      .updateProject(id, { paid: event.target.checked })
      .subscribe();
  }
}
