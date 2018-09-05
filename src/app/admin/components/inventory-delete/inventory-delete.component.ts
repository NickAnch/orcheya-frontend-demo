import { Component, EventEmitter } from '@angular/core';
import { Inventory } from '../../../core/models/inventory';
import { InventoriesService } from '../../services/inventories.service';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventory-delete',
  templateUrl: './inventory-delete.component.html'
})
export class InventoryDeleteComponent {
  public inventory: Inventory;
  public onInventoryDelete: EventEmitter<object> = new EventEmitter();
  public errors: string[] = null;

  constructor(private _inventoriesService: InventoriesService,
              public modalRef: BsModalRef) { }

  public deleteInventory(): void {
    this._inventoriesService
      .deleteInventory(this.inventory)
      .subscribe(
        () => {
          this.onInventoryDelete.emit({ deleted: this.inventory });
        },
        (err: HttpErrorResponse) => {
          if (!err.error['status'] && !err.error['exception']) {
            this.errors = err.error;
          } else {
            this.errors = ['Unknown error'];
          }
        }
      );
  }

}
