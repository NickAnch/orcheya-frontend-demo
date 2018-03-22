import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromEvent';

import { UsersListService } from '../../services/users-list.service';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPage implements OnInit, OnDestroy {

  @ViewChild('input') private inputField: ElementRef;

  public scrollWindow = false;
  public searchField = '';
  public usersList;
  private _page = 1;
  private ngOnInitSubscription: Subscription;
  private onSearchDelaySubscription: Subscription;
  private onScrollDownSubscription: Subscription;
  private onButtonClickSubscription: Subscription;


  constructor(private _usersListService: UsersListService) {
  }

  ngOnInit() {
    this.ngOnInitSubscription = this._usersListService
      .getUsersList(this._page)
      .subscribe(data => this.usersList = data.users);
  }

  ngOnDestroy() {
    if (this.ngOnInitSubscription) {
      this.ngOnInitSubscription.unsubscribe();
    }
    if (this.onScrollDownSubscription) {
      this.onScrollDownSubscription.unsubscribe();
    }
    if (this.onButtonClickSubscription) {
      this.onButtonClickSubscription.unsubscribe();
    }
    if (this.onSearchDelaySubscription) {
      this.onSearchDelaySubscription.unsubscribe();
    }
  }

  public onScrollDown() {
    this.onScrollDownSubscription = this._usersListService
      .getUsersList(++this._page)
      .subscribe(data => data.users
        .forEach(item => this.usersList.push(item)));
  }

  public onButtonClick() {
    this._page = 1;
    this.scrollWindow = false;
    this.onButtonClickSubscription = this._usersListService
      .getSearch(this.searchField)
      .subscribe(data => this.usersList = data.users);
  }

  public onSearchDelay() {
    this._page = 1;
    this.scrollWindow = false;
    this.onSearchDelaySubscription = Observable
      .fromEvent(this.inputField.nativeElement, 'keyup')
      .debounceTime(1000)
      .distinctUntilChanged()
      .switchMap(() => this._usersListService.getSearch(this.searchField))
      .subscribe(data => this.usersList = data.users);
  }

  public getUserById() {

  }
}
