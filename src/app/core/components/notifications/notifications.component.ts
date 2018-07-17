import {Component, Input, OnInit} from '@angular/core';
import {Notification} from '../../models/notification';
import {NotificationsService} from '../../services/notifications.service';

@Component({
  selector: '[app-notifications]', // tslint:disable-line
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private notifyService: NotificationsService) {
  }

  @Input() notifications: Array<Notification>;

  ngOnInit() {
  }

  read(id: number) {
    this.notifyService.read(id)
      .subscribe(
        res => {
          const index = this.notifications.findIndex(n => n.id === id);
          this.notifications.splice(index, 1);
        }
      );
  }

  readAll() {
    this.notifyService.readAll()
      .subscribe(
        res => this.notifications = []
      );
  }
}
