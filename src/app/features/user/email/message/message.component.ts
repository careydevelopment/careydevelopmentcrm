import { Component, OnInit } from '@angular/core';
import { EmailService } from '../service/email.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Email } from '../models/email';
import { AlertService } from 'carey-alert';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  email: Email;
  loading: boolean = true;

  constructor(private emailService: EmailService, private route: ActivatedRoute,
    private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.fetchEmail();
  }

  private fetchEmail() {
    let email$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.emailService.fetchMessageById(params.get('id')))
    );

    email$.subscribe(
      (email: Email) => this.handleEmailResponse(email),
      err => this.handleError(err)
    );
  }

  private handleEmailResponse(email: Email) {
    //console.log(email);
    this.email = email;
    this.loading = false;
  }

  private handleError(err: Error) {
    console.error(err);
    this.alertService.error("Problem - please contact support!");
    this.loading = false;
  }

  back() {
    let route = '/user/email/inbox';
    this.router.navigate([route]);
  }

  reply() {
    let route = '/user/email/compose-email';
    this.router.navigate([route], { state: { currentEmail: this.email } });
  }
}
