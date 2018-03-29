import { Alias, AppModel } from 'tsmodels';


export class Image extends AppModel {
  @Alias() public medium: string;
  @Alias() public small: string;
  @Alias() public thumbnail: string;

  public _fromJSON(data): Image {
    this.medium = data.medium.url;
    this.small = data.small.url;
    this.thumbnail = data.thumbnail.url;
    return this;
  }
}
