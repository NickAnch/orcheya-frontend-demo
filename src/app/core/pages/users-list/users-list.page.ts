import { Component, OnInit } from '@angular/core';
import { UsersListService } from '../../services/users-list.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPage implements OnInit {

  throttle = 300;
  scrollDistance = 2;

  public scrollWindow = false;
  public searchField = '';
  public usersList;
  private _page = 1;

  constructor(private _usersListService: UsersListService) {
  }

  ngOnInit() {
    this._usersListService.getUsersList(this._page)
      .subscribe((data) => {
        this.usersList = data.users;
      });
  }

  onScrollDown() {
    this._usersListService.getUsersList(++this._page)
      .subscribe((data) => {
        data.users.forEach((element) => {
          this.usersList.push(element);
        });
      });
  }

  onButtonClick() {
    this._page = 1;
    this.scrollWindow = false;
    this._usersListService.getSearch(this.searchField)
      .subscribe((data) => {
        this.usersList = data.users;
      });
  }
}