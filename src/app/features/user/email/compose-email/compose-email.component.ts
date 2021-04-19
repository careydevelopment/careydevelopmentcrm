import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../../ui/alert/alert.service';
import { UserService } from '../../../service/user.service';
import { Email } from '../models/email';
import { EmailService } from '../service/email.service';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.css']
})
export class ComposeEmailComponent implements OnInit {

  form: FormGroup;
  formSubmitted: boolean = false;

  email: Email;

  lastField: string = 'to';

  editorStyle = {
    height: '300px',
    backgroundColor: '#ffffff'
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'Tab' && this.lastField == 'subject') {
      let el: any = document.querySelectorAll('.ql-editor')

      if (el && el.length == 1) {
        el[0].focus();
        this.lastField = 'body';
      }
    }
  }

  constructor(private fb: FormBuilder, private emailService: EmailService,
    private userService: UserService, private alertService: AlertService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.createFormGroup();
  }

  private createFormGroup() {
    this.form = this.fb.group({
      'html': ['', Validators.compose([Validators.required])],
      'to': ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      'subject': ['', Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    this.formSubmitted = true;

    this.email = {} as Email;
    this.email.date = Date.now();
    this.email.from = this.userService.user.email;
    this.email.html = this.form.get('html').value;
    this.email.subject = this.form.get('subject').value;
    this.email.to = this.form.get('to').value;

    console.log(this.email);

    this.emailService.sendEmail(this.email).subscribe(
      (email: Email) => this.handleSendResponse(email),
      (err: Error) => this.handleSendError(err)
    );
  }

  private handleSendResponse(email: Email) {
    console.log("email send ID is " + email.id);
    this.alertService.success("Email sent successfully!", { keepAfterRouteChange: true });
    this.router.navigate(['/user/email/inbox']);
  }

  private handleSendError(err: Error) {
    this.alertService.error("Problem sending email!");
    console.error(err);
    this.formSubmitted = false;
  }

  blur(field: string) {
    this.lastField = field;
  }
}
