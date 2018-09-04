import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';
import { Inventory } from '../../models/inventory';

@Component({
  selector: 'app-user-inventory',
  templateUrl: './user-inventory.component.html',
  styleUrls: ['./user-inventory.component.scss']
})
export class UserInventoryComponent implements OnInit {
  public inventories: Inventory[];

  constructor(private _currentUser: CurrentUserService) { }

  ngOnInit() {
    this._currentUser.load()
      .subscribe((user) => {
        this.inventories = user.inventories;
      });
  }

  public updateSerial(serial: number): string {
    if (serial.toString().length < 4) {
      let str = serial.toString();
      while (str.length < 4) {
        str = '0' + str;
      }
      return str;
    } else {
      return serial.toString();
    }
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

}
