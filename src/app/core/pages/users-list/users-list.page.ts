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
import { User, positions } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { UserFilter } from '../../models/user-filter';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('input') private inputField: ElementRef;
  @ViewChild('form') private form: NgForm;

  public usersList: User[];
  public positions = positions;
  public positionKeys = Object.keys(positions);
  public filter = new UserFilter();
  private subscriptions: Subscription[] = [];

  constructor(private usersListService: UsersListService) {}

  ngOnInit() {
    this.usersListService
      .getUsersList(this.filter)
      .subscribe(data => this.usersList = data.users);
  }

  ngAfterViewInit() {
    this.subscriptions.push(Observable
      .fromEvent(this.inputField.nativeElement, 'keyup')
      .debounceTime(1000)
      .distinctUntilChanged()
      .switchMap(() => this.usersListService.getUsersList(this.filter))
      .subscribe(data => this.usersList = data.users)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      subscription => subscription.unsubscribe()
    );
  }

  public onPositionChange(): void {
    const position = this.form.value.position;
    this.filter.page = 1;
    this.filter.role = position ? position : undefined;

    this.usersListService
      .getUsersList(this.filter)
      .subscribe(data => this.usersList = data.users);
  }

  public onButtonClick() {
    this.filter.page = 1;

    this.usersListService
      .getUsersList(this.filter)
      .subscribe(data => this.usersList = data.users);
  }

  public onSearchDelay() {
    this.filter.page = 1;
  }

  public action(event) {
    if (event.value && !this.inputField.nativeElement.value) {
      this.filter.page += 1;

      this.usersListService
        .getUsersList(this.filter)
        .subscribe(
          data => this.usersList = [...this.usersList, ...data.users]
        );
    }
  }
}
