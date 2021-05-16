import { Injectable } from '@angular/core';
import { AuthenticationService } from 'carey-auth';
import { Observable } from 'rxjs';
import { EmailService } from '../features/user/email/service/email.service';

@Injectable({ providedIn: 'root' })
export class LogoutService {

  private logoutListener$: Observable<boolean>;

  constructor(private emailService: EmailService, private authenticationService: AuthenticationService) {
    this.logoutListener$ = authenticationService.authNotification$;

    this.logoutListener$.subscribe(
      (statusChange: boolean) => this.handleStatusChange(statusChange)
    );
  }

  private handleStatusChange(loginStatus: boolean) {
    if (!loginStatus) {
      //user logged out
      this.emailService.clearObservables();
    }
  }
}
