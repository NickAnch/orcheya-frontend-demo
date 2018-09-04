import { Component, OnInit, EventEmitter } from '@angular/core';
import { Inventory } from '../../../core/models/inventory';
import { InventoriesService } from '../../services/inventories.service';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../core/models/user';
import { UsersService } from '../../services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  public startAt = new Date();
  public form: FormGroup;
  private _resErrors = {};

  constructor(private _inventoriesService: InventoriesService,
              public modalRef: BsModalRef,
              private _formBuilder: FormBuilder,
              private _usersService: UsersService) { }

  ngOnInit() {
    this._usersService
      .getUsersList()
      .subscribe((data) => {
        this.users = data.users;
      });

    this.form = this._formBuilder.group({
      userId: [this.userId, [Validators.required]],
      startAt: [this.startAt, [Validators.required,
                               Validators.pattern('.*[\\S].*')]]
    });
  }

  public giveInventory() {
    const user = this.users.find(u => u.id === Number(this.form.value.userId));
    this._inventoriesService
      .giveInventory(this.inventory,
                     this.form.value.userId,
                     this.form.value.startAt)
      .subscribe(
        (inventory) => {
          this.onInventoryGive.emit({inventory: inventory,
            user: user, startAt: this.form.value.startAt});
        },
        (err: HttpErrorResponse) => {
          if (!err.error['status'] && !err.error['exception']) {
            this._resErrors = err.error;
          }
        }
      );
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
