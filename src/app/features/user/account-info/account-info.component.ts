import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      'firstName': ['', Validators.compose([Validators.required])],
      'lastName': ['', Validators.compose([Validators.required])],
      'street1': ['', Validators.compose([Validators.required])],
      'street2': [''],
      'city': ['', Validators.compose([Validators.required])],
      'state': ['', Validators.compose([Validators.required])],
      'zip': ['', Validators.compose([Validators.required])],
      'country': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required])],
      'phoneNumber': ['', Validators.compose([Validators.required])]
    });
  }

}
