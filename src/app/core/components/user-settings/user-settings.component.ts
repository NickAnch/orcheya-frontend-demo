import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CurrentUserService } from '../../services/current-user.service';
import { User } from '../../models/user';

import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions
} from 'ngx-uploader';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  @ViewChild('fileInput') public fileInput;
  public form: FormGroup;
  private respErrors: Object = {};
  private updatedUser = new User();

  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  constructor(public currentUser: CurrentUserService,
              private formBuilder: FormBuilder) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.currentUser.name, [Validators.required]],
      surname: [this.currentUser.surname, [Validators.required]],
      birthday: [this.currentUser.birthday, []],
      sex: [this.currentUser.sex, []],
      email: [
        this.currentUser.email,
        [Validators.required, Validators.email]
      ],
      github: [this.currentUser.github, []],
      bitbucket: [this.currentUser.bitbucket, []],
      skype: [this.currentUser.skype, []],
      phone: [this.currentUser.phone, []],
    });
  }

  public hasError(controlName: string): boolean {
    return !(this.form.get(controlName).valid && !this.respErrors[controlName]);
  }

  public updateSettings() {
    if (!this.form.valid) {
      return;
    }

    this.updatedUser._fromJSON(this.form.value);

    this.currentUser
      .updateSettings(this.updatedUser)
      .subscribe(
        () => this.respErrors = {},
        (err: HttpErrorResponse) => {
          if (!err.error['status'] && !err.error['exception']) {
            this.respErrors = err.error;
          }
        }
      )
    ;
  }

  public textError(controlName: string): string {
    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors['required']) {
        return `${controlName} is required`;
      } else if (this.form.get(controlName).errors['email']) {
        return `${controlName} is not valid email`;
      }
    }

    if (this.respErrors[controlName]) {
      return this.respErrors[controlName];
    }
  }

  public addFile(): void {
    const fileInput = this.fileInput.nativeElement;
    if (fileInput.files && fileInput.files[0]) {
      const fileToUpload = fileInput.files[0];
      this.currentUser
        .upload(fileToUpload)
        .subscribe(res => {
          console.log(res);
        });
    }
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: '/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' }
      // };
      // this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://ngx-uploader.com/upload',
      method: 'POST',
      data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

}
