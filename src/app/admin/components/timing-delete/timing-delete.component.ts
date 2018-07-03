import { Component, EventEmitter, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TimingsService } from '../../services';
import { Timing } from '../../../core/models/timing';

@Component({
  selector: 'app-timing-delete',
  templateUrl: './timing-delete.component.html',
  styleUrls: ['./timing-delete.component.scss']
})

export class TimingDeleteComponent implements OnInit {
  public timing: Timing;
  public timings: Timing[];
  public newTimingId: number;

  public enabledTimings: Timing[];

  public onTimingDelete: EventEmitter<number> = new EventEmitter();

  public errors: string[] = null;

  constructor(private _timingsService: TimingsService) {
  }

  ngOnInit() {
    this.enabledTimings = this.timings
      .filter(timing => timing !== this.timing);
  }

  public delete() {
    this._timingsService
      .remove(this.timing, this.newTimingId)
      .subscribe(
        () => this.onTimingDelete.emit(this.newTimingId),
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
