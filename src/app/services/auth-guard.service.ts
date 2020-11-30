import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { RouteMessageService } from '../ui/route-message/route-message.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService,
    private routeMessageService: RouteMessageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let routeMessage: string = null;
    const isTokenExpired = this.authenticationService.isTokenExpired();

    if (!isTokenExpired) {
      const isLoggedIn = this.authenticationService.isLoggedIn();

      if (isLoggedIn) {
        return true;
      } else {
        routeMessage = "You must login to continue.";
      }
    } else {
      routeMessage = "Your session has expired."
    }

    if (routeMessage) this.routeMessageService.message = routeMessage;

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
