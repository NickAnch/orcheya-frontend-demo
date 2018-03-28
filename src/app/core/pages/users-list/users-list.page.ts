import {
  AfterViewInit,
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
import { User } from '../../models/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('input') private inputField: ElementRef;

  public scrollWindow = false;
  public searchField = '';
  public usersList;
  private page = 1;
  private ngOnInitSubscription: Subscription;
  private ngAfterViewInitSubscription: Subscription;
  private onScrollDownSubscription: Subscription;
  private onButtonClickSubscription: Subscription;


  constructor(private usersListService: UsersListService) {
  }

  ngOnInit() {
    this.ngOnInitSubscription = this.usersListService
      .getUsersList(this.page)
      .subscribe(data => this.usersList = data.users);
  }

  ngAfterViewInit() {
    this.ngAfterViewInitSubscription = Observable
      .fromEvent(this.inputField.nativeElement, 'keyup')
      .debounceTime(1000)
      .distinctUntilChanged()
      .switchMap(() => this.usersListService.getSearch(this.searchField))
      .subscribe(data => this.usersList = data.users);
  }

  ngOnDestroy() {
    if (this.ngOnInitSubscription) {
      this.ngOnInitSubscription.unsubscribe();
    }
    if (this.ngAfterViewInitSubscription) {
      this.ngAfterViewInitSubscription.unsubscribe();
    }
    if (this.onScrollDownSubscription) {
      this.onScrollDownSubscription.unsubscribe();
    }
    if (this.onButtonClickSubscription) {
      this.onButtonClickSubscription.unsubscribe();
    }
  }

  public onScrollDown() {
    this.onScrollDownSubscription = this.usersListService
      .getUsersList(++this.page)
      .subscribe(data => data.users
        .forEach(item => this.usersList.push(item)));
  }

  public onButtonClick() {
    this.page = 1;
    this.scrollWindow = false;
    this.onButtonClickSubscription = this.usersListService
      .getSearch(this.searchField)
      .subscribe(data => this.usersList = data.users);
  }

  public onSearchDelay() {
    this.page = 1;
    this.scrollWindow = false;
  }

  fullNameAppender(user: User): string {
    return user.name + ' ' + user.surname;
  }
}
