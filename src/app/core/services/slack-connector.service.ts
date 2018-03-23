import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SlackConnectorService {

  constructor(private http: HttpClient) { }

  connect() {
    this.http.get('/api/integration/slack').subscribe(
      resp => window.location.href = resp['uri']
    )
  }
}
