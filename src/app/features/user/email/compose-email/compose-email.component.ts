import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  editorStyle = {
    height: '300px',
    backgroundColor: '#ffffff'
  }

  constructor(private fb: FormBuilder, private emailService: EmailService) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  private createFormGroup() {
    this.form = this.fb.group({
      'html': ['', Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    console.log(this.form);
  }
}
