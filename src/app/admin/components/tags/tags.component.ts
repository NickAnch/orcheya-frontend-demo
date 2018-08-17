import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../core/models/tag';
import { TagsService } from '../../services/tags.service';
import { BsModalService } from 'ngx-bootstrap';
import { TagEditComponent } from '../tag-edit/tag-edit.component';
import { TagDeleteComponent } from '../tag-delete/tag-delete.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  public tags: Tag[];
  public tag: Tag = new Tag();

  constructor(private _tagsService: TagsService,
              private _modalService: BsModalService) { }

  ngOnInit() {
    this._tagsService
        .getTags()
        .subscribe(
          (data) => {
            this.tags = data;
            console.log(data);
          }
        );
  }

  public addTag(): void {
    const initialState = {
      tag: new Tag(),
      type: 'new'
    };
    const modal = this._modalService
      .show(TagEditComponent, { initialState });
    modal.content
         .onTagUpdate
         .subscribe(
           (data) => {
              this.tags.unshift(data);
              modal.hide();
         });
  }

  public editTag(tag: Tag): void {
    const initialState = {
      tag: tag,
      type: 'edit'
    };
    const modal = this._modalService
      .show(TagEditComponent, { initialState });
    modal.content
         .onTagUpdate
         .subscribe(
           (data) => {
              tag._fromJSON(data._toJSON());
              this.tags.splice(this.tags.indexOf(tag), 1, data);
              modal.hide();
          });
  }

  public deleteTag(tag: Tag): void {
    const initialState = {
      tag: tag,
      tags: this.tags
    };
    const modal = this._modalService
      .show(TagDeleteComponent, { initialState });
    modal.content
      .onTagDelete
      .subscribe(data => {
        this.tags
          .find((t) => t === data.new);
        this.tags.splice(this.tags.findIndex((t) => t === tag), 1);
        modal.hide();
      });
  }

}
