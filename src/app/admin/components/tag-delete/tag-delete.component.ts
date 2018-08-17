import { Component, OnInit, EventEmitter } from '@angular/core';
import { Tag } from '../../../core/models/tag';
import { TagsService } from '../../services/tags.service';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tag-delete',
  templateUrl: './tag-delete.component.html',
  styleUrls: ['./tag-delete.component.scss']
})
export class TagDeleteComponent implements OnInit {
  public tag: Tag;
  public tags: Tag[];
  public enabledTags: Tag[];
  public newTagId: number;
  public onTagDelete: EventEmitter<object> = new EventEmitter();
  public errors: string[] = null;

  constructor(private _tagsService: TagsService,
              public modalRef: BsModalRef) { }

  ngOnInit() {
    this.enabledTags = this.tags.filter((t) => t !== this.tag);
  }

  public deleteTag() {
    const newTag = this.tags.find((t) => t.id === Number(this.newTagId));
    this._tagsService
      .deleteTag(this.tag, newTag)
      .subscribe(
        () => {
          this.onTagDelete.emit({ deleted: this.tag, new: newTag });
        },
        (err: HttpErrorResponse) => {
          if (err.error && err.error.base && err.error.base.length > 0) {
            this.errors = err.error.base;
          } else {
            this.errors = ['Unknown error'];
          }
        }
      );
  }

}
