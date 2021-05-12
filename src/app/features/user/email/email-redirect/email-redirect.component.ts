import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User, UserService } from 'carey-user';
import { switchMap } from 'rxjs/operators';
import { EmailService } from '../service/email.service';

@Component({
  selector: 'app-email-redirect',
  templateUrl: './email-redirect.component.html',
  styleUrls: ['./email-redirect.component.css']
})
export class EmailRedirectComponent implements OnInit {

  constructor(private emailService: EmailService, private route: ActivatedRoute,
    private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    let redirect$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.emailService.fetchToken(params.get('code')))
    );

    redirect$.subscribe(
      (token: string) => this.handleResponse(token),
      err => this.handleError(err)
    );
  }

  private handleResponse(token: string) {
    //console.log("token is " + token);
    let user: User = this.userService.user;
    this.emailService.updateUserEmailChoice(user, 'GMAIL').subscribe(
      (response: any) => this.handleUpdateEmailChoiceResponse(response),
      err => this.handleUpdateEmailChoiceError(err)
    )
  }

  private handleUpdateEmailChoiceResponse(response: any) {
    this.reroute();
  }

  private handleUpdateEmailChoiceError(err: Error) {
    console.error(err);
  }

  private reroute() {
    let route = '/user/email/inbox';
    this.router.navigate([route]);
  }

  private handleError(err: Error) {
    console.error(err);
  }
}
