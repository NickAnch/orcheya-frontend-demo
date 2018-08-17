import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Tag } from '../../../core/models/tag';
import { TagsService } from '../../services/tags.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.scss']
})

export class TagEditComponent implements OnInit {
  public tag: Tag;
  private _type: String;
  public form: FormGroup;
  public onTagUpdate: EventEmitter<Tag> = new EventEmitter();
  private _resErrors = {};

  constructor(private _tagsService: TagsService,
              private  _formBuilder: FormBuilder,
              public modalRef: BsModalRef) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      name: [this.tag.name, [Validators.required,
                             Validators.pattern('.*[\\S].*')]]
    });
  }

  public saveData(): void {
    Object.assign(this.tag, this.form.value);
    if (this._type === 'new') {
      this._tagsService
        .addTag(this.tag)
        .subscribe(
          tag => {
            this._resErrors = {};
            this.onTagUpdate.emit(tag);
          },
          (err: HttpErrorResponse) => {
            if (!err.error['status'] && !err.error['exception']) {
              this._resErrors = err.error;
            }
          });
    }
    if (this._type === 'edit') {
      this._tagsService
        .editTag(this.tag)
        .subscribe(
          tag => {
            this._resErrors = {};
            this.onTagUpdate.emit(tag);
          },
          (err: HttpErrorResponse) => {
            if (!err.error['status'] && !err.error['exception']) {
              this._resErrors = err.error;
            }
          });
    }
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }
    if (this._resErrors[controlName]) {
      return this._resErrors[controlName];
    }
    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors['required']) {
        return `${controlName} is required`;
      } else if (this.form.get(controlName).errors['pattern']) {
        return `${controlName} can't be empty`;
      }
    }
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this._resErrors[controlName]
    );
  }
}
