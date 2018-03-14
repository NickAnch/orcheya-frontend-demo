import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss']
})
export class EditUserPage {
  @ViewChild('upload') public upload;

  constructor() { }

  public inputClickEmitter(): void {
    this.upload.nativeElement.click();
  }

}
