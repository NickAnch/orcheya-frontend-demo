import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.scss']
})
export class UserLinksComponent implements OnInit {
  public form: FormGroup;
  public userLinks: FormArray;

  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this._fb.group({
      userLinks: this._fb.array([this.createLink()]),
    })
  }

  public createLink(): FormGroup {
    return this._fb.group({
      link: '',
    })
  }

  public addLink(): void {
    this.userLinks = this.form.get('userLinks') as FormArray;
    this.userLinks.push(this.createLink());
    console.log(this.form.value);
  }

  public removeUserLink(i: number): void {
    console.log(i);
  }
}
