import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthenticationService } from 'carey-auth';
import { Router } from '@angular/router';
import { AlertService } from 'carey-alert';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService, private router: Router,
    private alertService: AlertService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let handled: boolean = false;

    return next.handle(request)
    .pipe(
      //taking out retry for now because it's even retrying on bad credentials
      //retry(1),
      catchError((returnedError) => {
        let errorMessage = null;
        console.log("Returned error", returnedError.error);

        if (returnedError.error instanceof ErrorEvent) {
          errorMessage = `Error: ${returnedError.error.message}`;
        } else if (returnedError instanceof HttpErrorResponse) {
          errorMessage = `Error Status ${returnedError.status}: ${returnedError.message}`;
          handled = this.handleServerSideError(returnedError);
        } 

        console.error(errorMessage ? errorMessage : returnedError);

        if (!handled) {
          return throwError(returnedError);
        } else {
          return of(returnedError);
        }
      })
    )
  }

  private handleServerSideError(error: HttpErrorResponse): boolean {
    let handled: boolean = false;

    switch (error.status) {
      case 401:
        //we don't want to redirect people to the login page when they're already on
        //the login page
        if (this.router.url != '/login') {
          this.alertService.info("Please login again.", { keepAfterRouteChange: false });
          this.authenticationService.logout();
          handled = true;
        }

        break;
      case 403:
        this.alertService.info("Please login again.", { keepAfterRouteChange: false });
        this.authenticationService.logout();
        handled = true;
        break;
    }

    return handled;
  }
}
