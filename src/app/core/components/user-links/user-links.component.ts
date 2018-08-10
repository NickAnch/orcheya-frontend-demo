import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { UserLinksService } from '../../services/user-links.service';
import { UserLink } from '../../models/user-links';
import { SERVICES } from './allowed-services';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.scss']
})
export class UserLinksComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public userLinks: FormArray;
  private _subscriptions: Subscription[] = [];
  public kinds = [];

  constructor(
    private _fb: FormBuilder,
    private _linksService: UserLinksService,
    private _currentUser: CurrentUserService,
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      userLinks: this._fb.array([]),
    });
    this._linksService.links.subscribe((links: UserLink[]) => {
      if (links.length > 0) {
        links.forEach((link: UserLink, index: number) => {
          this.addLink(link);
          this.kinds[index] = link.kind;
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
        [Validators.pattern(reg)],
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
          const formControlIndex = this._findUserLinkIndex(changedInput);
          if (this.userLinks.controls[formControlIndex].valid) {
            if (changedInput.id !== null) {
              this._updateUserLinks(changedInput, index);
            } else {
              this._createUserLinks(changedInput, index);
            }
          }
        })
    );
  }

  private _findUserLinkIndex(changedControlValue: UserLink): number {
    let controlIndex;
    this.userLinks.controls
      .forEach((control: AbstractControl, index: number) => {
        if (control.value === changedControlValue) {
          controlIndex = index;
        }
      });
    return controlIndex;
  }

  public removeUserLink(index: number): void {
    const linkId = this.userLinks.controls[index].value.id;
    const formArray = <FormArray>this.form.controls['userLinks'];
    if (formArray.controls.length > 0) {
      formArray.removeAt(index);
    }
    this.kinds.splice(index, 1);
    if (linkId !== null) {
      this._linksService
        .removeUserLink(linkId, this._currentUser.id, index)
        .subscribe();
    }
    this._subscriptions[index].unsubscribe();
  }

  private _createUserLinks(link: UserLink, index: number): void {
    this._linksService.newUserLink(link, this._currentUser.id)
      .subscribe((response: UserLink) => {
        this.userLinks.controls[index]
          .patchValue({
            id: response.id,
            kind: response.kind,
          });
      });
  }

  private _updateUserLinks(link: UserLink, index: number): void {
    this._linksService.updateUserLink(link, this._currentUser.id)
      .subscribe((response: UserLink) => {
        this.kinds[index] = response.kind;
      });
  }

  public makeIconClassName(kind: string): string {
    if (SERVICES.includes(kind)) {
      if (kind === 'stackoverflow') {
        return 'fa-stack-overflow';
      } else {
        return `fa-${kind}`;
      }
    } else {
      return 'fa-link';
    }
  }
}
