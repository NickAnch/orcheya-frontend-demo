import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { timeFormat } from 'd3-time-format';

import { TimeActivity } from '../../models/time-activity.interface';

@Component({
  selector: 'app-time-this-week',
  templateUrl: './time-this-week.component.html',
  styles: [`
    .app-wrapper { padding: 10px 0 }
  `]
})
export class TimeThisWeekComponent implements OnInit {
  @Input() public width = '100%';
  @Input() private activity: Observable<TimeActivity[]>;
  public weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public times = ['0', '0', '0', '0', '0', '0', '0'];
  public totalWeekTimeText: string;
  private totalWeekTime = 0;

  ngOnInit() {
    this.activity
      .subscribe(data => (
        this.updateTimes(data.splice(-7))
      ));
  }

  private static getMonday(): Date {
    const date = new Date();
    const day = date.getDay();

    if (day === 0) {
      date.setDate(date.getDate() - 6);
    } else if (day > 1) {
      date.setDate(date.getDate() - day + 1);
    }

    return date;
  }

  private static convertTime(time: number): string {
    if (!time) {
      return '0';
    }

    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    return `${hours}h ${minutes}m`;
  }

  private updateTimes(activity: TimeActivity[]) {
    console.log(activity);
    const date = TimeThisWeekComponent.getMonday();

    this.times = this.times.map((val, i) => {
      if (i !== 0) {
        date.setDate(date.getDate() + 1);
      }

      const strDate = timeFormat('%Y-%m-%d')(date);
      const activityPeace = activity.find(d => d.date === strDate);
      this.totalWeekTime += activityPeace ? activityPeace.time : 0;

      return activityPeace
        ? TimeThisWeekComponent.convertTime(activityPeace.time)
        : '0';
    });

    this.totalWeekTimeText = TimeThisWeekComponent
      .convertTime(this.totalWeekTime);
  }
}
