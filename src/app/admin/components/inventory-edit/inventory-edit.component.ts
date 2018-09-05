import { Component, OnInit, EventEmitter } from '@angular/core';
import { Inventory } from '../../../core/models/inventory';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoriesService } from '../../services/inventories.service';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html'
})
export class InventoryEditComponent implements OnInit {
  public inventory: Inventory;
  private _type: String;
  public form: FormGroup;
  public onInventoryUpdate: EventEmitter<Inventory> = new EventEmitter();
  private _resErrors = {};
  public purchased: Date;
  constructor(private _inventoriesService: InventoriesService,
              private _formBuilder: FormBuilder,
              public modalRef: BsModalRef) { }

  ngOnInit() {
    if (this.inventory.purchasedAt) {
      this.purchased = new Date(this.inventory.purchasedAt);
    }
    this.form = this._formBuilder.group({
      purchasedAt: [this.purchased, [Validators.required,
                                           Validators.pattern('.*[\\S].*')]],
      title: [this.inventory.title, [Validators.required,
                                     Validators.pattern('.*[\\S].*')]],
      price: [this.inventory.price, [Validators.required,
                                     Validators.pattern(/^\d+(\.\d+)?$/)]],
      life: [this.inventory.life, [Validators.required,
                                     Validators.pattern(/^\d+$/)]]
    });
  }

  public saveData(): void {
    Object.assign(this.inventory, this.form.value);
    if (this._type === 'new') {
      this._inventoriesService
        .addInventory(this.inventory)
        .subscribe(
          (inventory) => {
            this._resErrors = {};
            this.onInventoryUpdate.emit(inventory);
          },
          (err: HttpErrorResponse) => {
            if (!err.error['status'] && !err.error['exception']) {
              this._resErrors = err.error;
            }
          });
    }
    if (this._type === 'edit') {
      this._inventoriesService
        .editInventory(this.inventory)
        .subscribe(
          (inventory) => {
            this._resErrors = {};
            this.onInventoryUpdate.emit(inventory);
          },
          (err: HttpErrorResponse) => {
            if (!err.error['status'] && !err.error['exception']) {
              this._resErrors = err.error;
            }
          });
    }
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }
    if (this._resErrors[controlName]) {
      return this._resErrors[controlName];
    }
    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors['required']) {
        return `${controlName} is required`;
      } else if (this.form.get(controlName).errors['pattern']) {
        return 'Invalid characters are used';
      }
    }
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this._resErrors[controlName]
    );
  }

}
