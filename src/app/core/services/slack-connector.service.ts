import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SlackConnectorService {

  constructor(private _http: HttpClient) { }

  connect() {
    this._http.get('/api/integration/slack').subscribe(
      (resp) => window.location.href = resp['uri']
    )
  }
}
