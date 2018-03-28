import { Component, OnInit } from '@angular/core';
import { ActivityData } from '../../../shared/time-activity/time-activity.component';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent {
  public activityData: ActivityData[] = [
    { date: '2018-03-18', time: 240 },
    { date: '2018-03-17', time: 380 },
    { date: '2018-03-16', time: 670 },
    { date: '2018-03-07', time: 540 },
    { date: '2018-03-06', time: 310 },
    { date: '2018-03-05', time: 480 },
    { date: '2017-04-19', time: 620 },
    { date: '2017-04-20', time: 330 },
    { date: '2017-04-21', time: 490 },
    { date: '2017-04-22', time: 500 },
    { date: '2017-04-23', time: 200 },
    { date: '2017-04-24', time: 700 },
    { date: '2017-04-27', time: 500 },
    { date: '2017-04-28', time: 450 },
  ];
}
