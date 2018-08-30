import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Inventory } from '../../core/models/inventory';

const ADMIN_INVENTORIES_URL = '/api/admin/inventories';

@Injectable()
export class InventoriesService {

  constructor(private _http: HttpClient) { }

  public getInventories(): Observable<Inventory[]> {
    return Observable.create((observer: Observer<Inventory[]>) => {
      this._http
        .get<Inventory[]>(`${ADMIN_INVENTORIES_URL}`)
        .subscribe(
          (response) => {
            observer.next(Inventory
              .newCollection(Inventory, response));
            observer.complete();
          },
          (error) => observer.error(error)
        );
    });
  }

  public addInventory(inventory: Inventory): Observable<Inventory> {
    return Observable.create((observer: Observer<Inventory>) => {
      this._http
        .post<Inventory>(`${ADMIN_INVENTORIES_URL}`, inventory._toJSON())
        .subscribe(
          (response) => {
            observer.next(Inventory.new(Inventory, response['inventory']));
            observer.complete();
          },
          (error) => observer.error(error)
        );
    });
  }

  public editInventory(inventory: Inventory): Observable<Inventory> {
    return Observable.create((observer: Observer<Inventory>) => {
      this._http
        .put<Inventory>(`${ADMIN_INVENTORIES_URL}/${inventory.id}`,
                        inventory._toJSON())
        .subscribe(
          (response) => {
            observer.next(Inventory.new(Inventory, response['inventory']));
            observer.complete();
          },
          (error) => observer.error(error)
        );
    });
  }

  public deleteInventory(inventory: Inventory): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .delete(`${ADMIN_INVENTORIES_URL}/${inventory.id}`)
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          (error) => observer.error(error)
        );
    });
  }

  public takeInventory(inventory: Inventory): Observable<Inventory> {
    return Observable.create((observer: Observer<Inventory>) => {
      this._http
        .post(`${ADMIN_INVENTORIES_URL}/${inventory.id}/take`,
          inventory)
        .subscribe(
          (response) => {
            observer.next(Inventory.new(Inventory, response));
            observer.complete();
          },
          (error) => observer.error(error)
        );
    });
  }

  public giveInventory(inventory: Inventory,
    userId: Number): Observable<Inventory> {
    return Observable.create((observer: Observer<Inventory>) => {
      this._http
        .post(`${ADMIN_INVENTORIES_URL}/${inventory.id}/give`,
          {user_id: userId})
        .subscribe(
          (response) => {
            observer.next(Inventory.new(Inventory, response));
            observer.complete();
          },
          (error) => observer.error(error)
        );
    });
  }

}
