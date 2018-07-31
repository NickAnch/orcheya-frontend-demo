import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.scss']
})
export class UserLinksComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public userLinks: FormArray;
  private _subscription: Subscription;

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      userLinks: this._fb.array([this.createLink()]),
    });
    this.subscribeChanges();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public createLink(): FormGroup {
    return this._fb.group({
      link: '',
    });
  }

  public addLink(): void {
    this.userLinks = this.form.get('userLinks') as FormArray;
    this.userLinks.push(this.createLink());
  }

  public removeUserLink(index: number): void {
    const control = <FormArray>this.form.controls['userLinks'];
    if (index !== 0) {
      control.removeAt(index);
    }
  }

  private subscribeChanges(): void {
    this._subscription = this.form
      .valueChanges
      .debounceTime(500)
      .subscribe((changedForm) => {
        if (this.form.valid) {
          console.log(changedForm);
        }
      });
  }
}
