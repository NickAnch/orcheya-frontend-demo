import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TimeDoctorConnectorService {

  constructor(private http: HttpClient) { }

  connect() {
    this.http.get('/api/integration/timedoctor').subscribe(
      resp => window.location.href = resp['uri']
    )
  }
}
