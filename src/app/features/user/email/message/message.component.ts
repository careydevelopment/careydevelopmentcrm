import { Component, OnInit } from '@angular/core';
import { EmailService } from '../service/email.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Email } from '../models/email';
import { AlertService } from '../../../../ui/alert/alert.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  private email: Email;
  private loading: boolean = true;

  constructor(private emailService: EmailService, private route: ActivatedRoute,
    private alertService: AlertService) { }

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
}
