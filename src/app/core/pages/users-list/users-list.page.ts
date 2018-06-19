import {
  AfterViewInit, Component, ElementRef,
  OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromEvent';

import { UsersListService } from '../../services/users-list.service';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { UserFilter } from '../../models/user-filter';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('input') private inputField: ElementRef;
  @ViewChild('form') private form: NgForm;

  public usersList: User[];
  public filter = new UserFilter();
  public roles: Role[];
  private subscriptions: Subscription[] = [];

  constructor(private usersListService: UsersListService,
              private _rolesService: RolesService) {}

  ngOnInit() {
    this._rolesService
      .getList()
      .subscribe(x => this.roles = x);

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

  public onRoleChanged(): void {
    this.filter.page = 1;
    this.filter.roleIs = this.form.controls['role'].value;

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
