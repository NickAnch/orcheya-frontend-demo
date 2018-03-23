import { Component, OnInit, Input } from '@angular/core';
import { SlackConnectorService } from '../../../services/slack-connector.service';

@Component({
  selector: 'app-slack-connect-button',
  templateUrl: './slack-connect-button.component.html',
  styleUrls: ['./slack-connect-button.component.scss']
})
export class SlackConnectButtonComponent {

  constructor(private slackConnector: SlackConnectorService) { }

  @Input() connected: boolean

  connect() {
    this.slackConnector.connect()
  }
}
