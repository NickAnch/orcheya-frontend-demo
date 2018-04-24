import { Component, Input } from '@angular/core';
import { IntegrationsService } from '../../../services/integrations.service';

@Component({
  selector: 'app-timedoctor-connect-button',
  templateUrl: './timedoctor-connect-button.component.html',
  styleUrls: ['./timedoctor-connect-button.component.scss']
})
export class TimeDoctorConnectButtonComponent {
  @Input() connected: boolean;
  @Input() connectName = 'Connect';
  @Input() disconnectName = 'Disconnect';

  constructor(private integrationService: IntegrationsService) {}

  public onClick() {
    this.connected
      ? this.disconnect()
      : this.connect();
  }

  private connect() {
    this.integrationService.timeDoctorConnect();
  }

  private disconnect() {
    this.integrationService
      .timeDoctorDisconnect()
      .subscribe();
  }
}
