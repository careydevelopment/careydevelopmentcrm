import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'carey-auth';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authenticationService.token();

    if (token) {
      if (this.authenticationService.isLoggedIn()) {
        request = this.setHeader(request, token);
      }
    }

    return next.handle(request);
  }

  private setHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return request;
  }
}
