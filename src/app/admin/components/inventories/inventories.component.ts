import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../core/models/inventory';
import { InventoriesService } from '../../services/inventories.service';
import { BsModalService } from 'ngx-bootstrap';
import {
  InventoryEditComponent
} from '../inventory-edit/inventory-edit.component';
import {
  InventoryDeleteComponent
} from '../inventory-delete/inventory-delete.component';
import {
  InventoryRemoveUserComponent
} from '../inventory-remove-user/inventory-remove-user.component';
import {
  InventoryAddUserComponent
} from '../inventory-add-user/inventory-add-user.component';
import { GivenInventory } from '../../../core/models/given-inventory';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.scss']
})
export class InventoriesComponent implements OnInit {
  public inventories: Inventory[];
  public inventory: Inventory = new Inventory();
  public zero: string;
  public serialStr: string;

  constructor(private _inventoriesService: InventoriesService,
              private _modalService: BsModalService) { }

  ngOnInit() {
     this._inventoriesService
      .getInventories()
      .subscribe((data) => {
        this.inventories = data;
      });
  }

  public addInventory(): void {
    const initialState = {
      inventory: new Inventory(),
      _type: 'new'
    };
    const modal = this._modalService
      .show(InventoryEditComponent, { initialState });
    modal.content
         .onInventoryUpdate
         .subscribe(
           (data) => {
             this.inventories.unshift(data);
             modal.hide();
         });
  }

  public editInventory(inventory: Inventory): void {
    const initialState = {
      inventory: inventory,
      _type: 'edit'
    };
    const modal = this._modalService
      .show(InventoryEditComponent, { initialState });
    modal.content
         .onInventoryUpdate
         .subscribe(
           (data) => {
             data.given = inventory.given;
             this.inventories.splice(this.inventories.indexOf(inventory),
               1, data);
             modal.hide();
         });
  }

  public deleteInventory(inventory: Inventory): void {
    const initialState = {
      inventory: inventory,
      inventories: this.inventories
    };
    const modal = this._modalService
      .show(InventoryDeleteComponent, { initialState });
    modal.content
      .onInventoryDelete
      .subscribe(() => {
        this.inventories.splice(this.inventories
                                    .findIndex((t) => t === inventory), 1);
        modal.hide();
      });
  }

  public takeInventory(inventory: Inventory): void {
    const initialState = {
      inventory: inventory
    };
    const modal = this._modalService
      .show(InventoryRemoveUserComponent, { initialState });
    modal.content
      .onInventoryTake
      .subscribe((data) => {
        inventory.given[inventory.given.length - 1].endedAt =
          data.updatedAt;
        modal.hide();
      });
  }

  public giveInventory(inventory: Inventory): void {
    const initialState = {
      inventory: inventory
    };
    const modal = this._modalService
      .show(InventoryAddUserComponent, { initialState });
    modal.content
      .onInventoryGive
      .subscribe((data) => {
        const newUserOfInventory = {
          id: data.inventory.id,
          user: data.user,
          startedAt: data.inventory.updatedAt,
          endedAt: null
        } as GivenInventory;
        inventory.given.push(newUserOfInventory);
        modal.hide();
      });
  }

  public showGiveButton(given): boolean {
    return given.length === 0 ||
      (given !== undefined && given[given.length - 1].endedAt);
  }

  public showTakeButton(given): boolean {
    return given.length > 0 &&
      (given !== undefined && !given[given.length - 1].endedAt);
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

}
