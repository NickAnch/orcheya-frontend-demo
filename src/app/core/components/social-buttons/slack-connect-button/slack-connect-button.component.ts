import { Component, Input } from '@angular/core';
import { IntegrationsService } from '../../../services/integrations.service';

@Component({
  selector: 'app-slack-connect-button',
  templateUrl: './slack-connect-button.component.html',
  styleUrls: ['./slack-connect-button.component.scss']
})
export class SlackConnectButtonComponent {
  @Input() connected = false;
  @Input() connectName = 'Connect';
  @Input() disconnectName = 'Disconnect';

  constructor(private integrationService: IntegrationsService) {}

  public onClick() {
    this.connected
      ? this.disconnect()
      : this.connect();
  }

  private connect() {
    this.integrationService.slackConnect();
  }

  private disconnect() {
    this.integrationService
      .slackDisconnect()
      .subscribe();
  }
}
