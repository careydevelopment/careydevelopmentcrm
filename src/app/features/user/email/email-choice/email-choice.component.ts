import { Component, OnInit } from '@angular/core';
import { AlertService } from 'carey-alert';
import { EmailService } from '../service/email.service';

@Component({
  selector: 'app-email-choice',
  templateUrl: './email-choice.component.html',
  styleUrls: ['./email-choice.component.css']
})
export class EmailChoiceComponent implements OnInit {

  constructor(private emailService: EmailService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  selectGmail() {
    this.emailService.getGoogleAuthCodeFlowUrl().subscribe(
      (url: string) => this.handleAuthCodeRetrieval(url),
      (err: Error) => this.handleAuthCodeError(err)
    )
  }

  private handleAuthCodeRetrieval(url: string) {
    window.location.assign(url);
  }

  private handleAuthCodeError(err: Error) {
    console.error(err);
    this.alertService.error("Problem connecting with Gmail!");
  }
}
