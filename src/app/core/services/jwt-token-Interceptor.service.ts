import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class JWTTokenInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token: string = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request)
      .catch((err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/sign-in']);
        }

        return Observable.throw(err);
      })
    ;
  }
}
