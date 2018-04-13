import {
  AfterViewInit, Component, ElementRef,
  OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromEvent';

import { UsersListService } from '../../services/users-list.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('input') private inputField: ElementRef;

  public searchField = '';
  public usersList: User[];
  private page = 1;
  private subscriptions: Subscription[] = [];

  constructor(private usersListService: UsersListService) {
  }

  ngOnInit() {
    this.usersListService
      .getUsersList(this.page)
      .subscribe(data => this.usersList = data.users);
  }

  ngAfterViewInit() {
    this.subscriptions.push(Observable
      .fromEvent(this.inputField.nativeElement, 'keyup')
      .debounceTime(1000)
      .distinctUntilChanged()
      .switchMap(() => this.usersListService.getSearch(this.searchField))
      .subscribe(data => this.usersList = data.users)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      subscription => subscription.unsubscribe()
    );
  }

  public onButtonClick() {
    this.page = 1;
    this.usersListService
      .getSearch(this.searchField)
      .subscribe(data => this.usersList = data.users);
  }

  public onSearchDelay() {
    this.page = 1;
  }

  public action(event) {
    if (event.value && !this.inputField.nativeElement.value) {
      this.usersListService
        .getUsersList(++this.page)
        .subscribe(
          data => this.usersList = [...this.usersList, ...data.users]
        );
    }
  }
}
