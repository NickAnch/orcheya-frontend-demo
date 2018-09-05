import { Component, OnInit, EventEmitter } from '@angular/core';
import { InventoriesService } from '../../services/inventories.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Inventory } from '../../../core/models/inventory';
import { HttpErrorResponse } from '@angular/common/http';
import { GivenInventory } from '../../../core/models/given-inventory';

@Component({
  selector: 'app-inventory-remove-user',
  templateUrl: './inventory-remove-user.component.html'
})
export class InventoryRemoveUserComponent {
  public inventory: Inventory;
  public onInventoryTake: EventEmitter<Inventory> = new EventEmitter();
  public errors: string[] = null;

  constructor(private _inventoriesService: InventoriesService,
              public modalRef: BsModalRef) { }

  public takeInventory(): void {
    this._inventoriesService
      .takeInventory(this.inventory)
      .subscribe(
        (inventory) => {
          this.onInventoryTake.emit(inventory);
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

  public getFirstUserOfSubject (given: GivenInventory[]): string {
    if (given !== undefined) {
      const userInfo = given[0].user;
      return `${userInfo.name} ${userInfo.surname} `;
    }
  }

}
