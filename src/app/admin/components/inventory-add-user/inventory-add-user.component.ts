import { Component, OnInit, EventEmitter } from '@angular/core';
import { Inventory } from '../../../core/models/inventory';
import { InventoriesService } from '../../services/inventories.service';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../core/models/user';
import { UsersService } from '../../services';

@Component({
  selector: 'app-inventory-add-user',
  templateUrl: './inventory-add-user.component.html',
  styleUrls: ['./inventory-add-user.component.scss']
})
export class InventoryAddUserComponent implements OnInit {
  public inventory: Inventory;
  public inventories: Inventory[];
  public users: User[];
  public userId: number;
  public onInventoryGive: EventEmitter<Object> = new EventEmitter();
  public errors: string[] = null;
  public startAt: Date;

  constructor(private _inventoriesService: InventoriesService,
              public modalRef: BsModalRef,
              private _usersService: UsersService) { }

  ngOnInit() {
    this._usersService
      .getUsersList()
      .subscribe((data) => {
        this.users = data.users;
      });
  }

  public giveInventory() {
    const user = this.users.find(u => u.id === Number(this.userId));
    this._inventoriesService
      .giveInventory(this.inventory, this.userId)
      .subscribe(
        (inventory) => {
          this.onInventoryGive.emit({inventory: inventory,
            user: user});
        },
        (err: HttpErrorResponse) => {
          if (err.error && err.error.base && err.error.base.length > 0) {
            this.errors = err.error.base;
          } else {
            this.errors = ['Unknown error'];
          }
        }
      );
  }

}
