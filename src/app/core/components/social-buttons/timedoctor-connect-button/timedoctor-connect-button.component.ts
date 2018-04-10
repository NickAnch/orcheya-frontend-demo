import { Component, Input } from '@angular/core';
import { IntegrationsService } from '../../../services/integrations.service';

@Component({
  selector: 'app-timedoctor-connect-button',
  templateUrl: './timedoctor-connect-button.component.html',
  styleUrls: ['./timedoctor-connect-button.component.scss']
})
export class TimeDoctorConnectButtonComponent {
  @Input() connected: boolean;

  constructor(private integrationService: IntegrationsService) {}

  connect() {
    this.integrationService.timeDoctorConnect();
  }

  disconnect() {
    this.integrationService
      .timeDoctorDisconnect()
      .subscribe();
  }
}
