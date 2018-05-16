import { Component, Input } from '@angular/core';
import { IntegrationsService } from '../../../services/integrations.service';

@Component({
  selector: 'app-upwork-connect-button',
  template: `
    <div class="integrations">
      <a class="btn btn-block"
         [ngClass]="connected ? 'btn-danger' : 'btn-success'"
         (click)="onClick()">
        {{ connected ? disconnectName : connectName }}
      </a>
    </div>
  `,
  styleUrls: ['./upwork-button.component.scss']
})
export class UpworkButtonComponent {
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
    this.integrationService.upworkConnect();
  }

  private disconnect() {
    this.integrationService
      .upworkDisconnect()
      .subscribe();
  }
}
