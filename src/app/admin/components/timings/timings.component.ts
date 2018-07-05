import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { TimingsService } from '../../services';
import { Timing } from '../../../core/models/timing';
import {
  TimingDeleteComponent
} from '../timing-delete/timing-delete.component';


@Component({
  selector: 'app-timings',
  templateUrl: './timings.component.html',
  styleUrls: ['./timings.component.scss']
})
export class TimingsComponent implements OnInit {
  public timings: Timing[];
  public timing: Timing = new Timing();
  public fromTime: string;
  public toTime: string;

  constructor(private _timingsService: TimingsService,
              private _modalService: BsModalService) { }

  ngOnInit() {
    this._timingsService
      .getTimingsList()
      .subscribe(x => this.timings = x);
  }

  public remove(timing: Timing): void {
    const initialState = {
      timing: timing,
      timings: this.timings.filter(x => x.id !== timing.id)
    };

    const modal = this._modalService
      .show(TimingDeleteComponent, { initialState });

    modal.content
      .onTimingDelete
      .subscribe(newId => {
        this.timings
          .find(x => +x.id === +newId)
          .usersCount += timing.usersCount;
        this.timings = this.timings.filter(x => x.id !== timing.id);
        modal.hide();
      });
  }

  public addTiming(): void {
    if (!this.fromTime || !this.toTime) {
      return;
    }

    this._timingsService
      .add(Timing.newPair(this.fromTime, this.toTime))
      .subscribe(x => {
        this.timings.push(x);
        this.fromTime = this.toTime = null;
      });
  }

  public convertDate(date: Date): string {
    const h = date.getHours();
    const m = date.getMinutes();
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
  }
}
