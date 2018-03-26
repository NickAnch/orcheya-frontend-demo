import { Component, OnInit, Input } from '@angular/core';
import {
  TimeDoctorConnectorService
} from '../../../services/timedoctor-connector.service';

@Component({
  selector: 'app-timedoctor-connect-button',
  templateUrl: './timedoctor-connect-button.component.html',
  styleUrls: ['./timedoctor-connect-button.component.scss']
})
export class TimeDoctorConnectButtonComponent {

  constructor(private tdConnector: TimeDoctorConnectorService) { }

  @Input() connected: boolean;

  connect() {
    this.tdConnector.connect();
  }
}
