import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { UserLinksService } from '../../services/user-links.service';
import { UserLink } from '../../models/userLinks';
import { Observable } from '../../../../../node_modules/rxjs/Observable';

@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.scss']
})
export class UserLinksComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public userLinks: FormArray;
  private _subscriptions: Subscription[] = [];

  constructor(
    private _fb: FormBuilder,
    private _linksService: UserLinksService,
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      userLinks: this._fb.array([]),
    });
    this._linksService.getUserLinks()
      .subscribe(response => {
        if (response.length > 0) {
          response.forEach((userLink: UserLink) => {
            this.addLink(userLink);
          });
        } else {
          this.addLink();
        }
      });
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private _createLinkFormGroup(userLink?: UserLink): FormGroup {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    return this._fb.group({
      link: [
        userLink ? userLink.link : '',
        [Validators.required, Validators.pattern(reg)],
      ],
      id: userLink ? userLink.id : null,
    });
  }

  public addLink(userLink?: UserLink): void {
    this.userLinks = this.form.get('userLinks') as FormArray;
    this.userLinks.push(this._createLinkFormGroup(userLink));
    const index = this.userLinks.controls.length - 1;
    const newInput = this.userLinks.controls[index];
    this._subscriptions.push(
      newInput
        .valueChanges
        .debounceTime(500)
        .distinctUntilChanged()
        .subscribe((changedInput: UserLink) => {
          console.log(changedInput);
          if (changedInput.id !== null) {
            console.log('old input data');
            this._updateUserLinks(changedInput);;
          } else {
            console.log('new input data');
            this._createUserLinks(changedInput, index);
          }
        })
    )
  }

  public removeUserLink(index: number): void {
    let linkId = this.userLinks.controls[index].value.id;
    const control = <FormArray>this.form.controls['userLinks'];
    if (index !== 0) {
      control.removeAt(index);
    }
    this._linksService.removeUserLink(linkId).subscribe();
    this._subscriptions[index].unsubscribe();
  }

  private _createUserLinks(link: UserLink, index: number): void {
    this._linksService.newUserLink(link)
      .subscribe(response => {
        this.userLinks.controls[index].patchValue({id: response.id});
      })
  }

  private _updateUserLinks(link: UserLink): void {
    this._linksService.updateUserLink(link).subscribe();
  }

  func() {
    console.log(this.form);
  }
}
