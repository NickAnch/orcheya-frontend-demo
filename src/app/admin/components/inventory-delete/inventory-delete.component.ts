import { Component, OnInit, EventEmitter } from '@angular/core';
import { Inventory } from '../../../core/models/inventory';
import { InventoriesService } from '../../services/inventories.service';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventory-delete',
  templateUrl: './inventory-delete.component.html',
  styleUrls: ['./inventory-delete.component.scss']
})
export class InventoryDeleteComponent implements OnInit {
  public inventory: Inventory;
  public onInventoryDelete: EventEmitter<object> = new EventEmitter();
  public errors: string[] = null;

  constructor(private _inventoriesService: InventoriesService,
              public modalRef: BsModalRef) { }

  ngOnInit() {
  }

  public deleteInventory() {
    this._inventoriesService
      .deleteInventory(this.inventory)
      .subscribe(
        () => {
          this.onInventoryDelete.emit({ deleted: this.inventory });
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
