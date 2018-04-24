import { Alias, AppModel } from 'tsmodels';

export class Project extends AppModel {
  @Alias() public id: number;
  @Alias() public name: string;

  constructor(project?: Object) {
    super();

    if (project) {
      this._fromJSON(project);
    }
  }
}
