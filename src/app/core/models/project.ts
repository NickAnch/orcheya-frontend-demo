import { Alias, Model  } from 'tsmodels';

export class Project extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public paid: boolean;
  @Alias() public platform: string;
  @Alias('created_at') public createdAt: Date;

  constructor(project?: Object) {
    super();

    if (project) {
      this._fromJSON(project);
    }
  }
}
