import { Component, OnInit } from '@angular/core';
import { UsersListService } from '../../services/users-list.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPage implements OnInit {

  public scrollWindow = false;
  public searchField = '';
  public usersList;
  private _page = 1;

  constructor(private _usersListService: UsersListService) {
  }

  ngOnInit() {
    this._usersListService
      .getUsersList(this._page)
      .subscribe((data) => {
        console.log(data, 'jdf');
        this.usersList = data.users;
      });

    let source = Observable.fromEvent(document.body, 'keyup');
  }

  onScrollDown() {
    this._usersListService
      .getUsersList(++this._page)
      .subscribe(data => data.users
        .forEach(item => this.usersList.push(item)));
  }

  onButtonClick() {
    this._page = 1;
    this.scrollWindow = false;
    this._usersListService
      .getSearch(this.searchField)
      .subscribe(data => this.usersList = data.users);
  }
}
