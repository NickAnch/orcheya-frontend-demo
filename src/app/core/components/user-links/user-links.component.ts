import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
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

  public createLink(userLink?: UserLink): FormGroup {
    return this._fb.group({
      link: userLink ? userLink.link : '' ,
      id: userLink ? userLink.id : null,
    });
  }

  public addLink(userLink?: UserLink): void {
    this.userLinks = this.form.get('userLinks') as FormArray;
    this.userLinks.push(this.createLink(userLink));
    const newInput =
      this.userLinks.controls[this.userLinks.controls.length - 1];
    this._subscriptions.push(
      newInput
        .valueChanges
        .debounceTime(500)
        .subscribe((changedInput: UserLink) => {
          if (changedInput.id !== null) {
            console.log('old input data');
            this._updateUserLinks(changedInput);;
          } else {
            console.log('new input data');
            this._createUserLinks(changedInput);
          }
        })
    )
  }

  public removeUserLink(index: number): void {
    // const control = <FormArray>this.form.controls['userLinks'];
    // if (index !== 0) {
    //   control.removeAt(index);
    // }
    console.log(this.userLinks.controls[index]);
    console.log(this._subscriptions[index]);
    this._subscriptions[index].unsubscribe();
  }

  private _createUserLinks(link: UserLink): void {
    this._linksService.newUserLinks(link)
      .subscribe(response => {
        console.log(response);
      })
  }

  private _updateUserLinks(link: UserLink): void {
    this._linksService.updateUserLinks(link)
      .subscribe(response => {
        console.log(response);
      })
  }
}
