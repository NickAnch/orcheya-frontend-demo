import { Component, Input } from '@angular/core';
import { IntegrationsService } from '../../../services/integrations.service';

@Component({
  selector: 'app-slack-connect-button',
  templateUrl: './slack-connect-button.component.html',
  styleUrls: ['./slack-connect-button.component.scss']
})
export class SlackConnectButtonComponent {
  @Input() connected: boolean;

  constructor(private integrationService: IntegrationsService) {}

  connect() {
    this.integrationService.slackConnect();
  }

  disconnect() {
    this.integrationService
      .slackDisconnect()
      .subscribe();
  }
}
