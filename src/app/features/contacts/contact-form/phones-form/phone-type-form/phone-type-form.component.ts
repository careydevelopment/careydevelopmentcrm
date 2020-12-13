import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'contact-phone-type-form',
  templateUrl: './phone-type-form.component.html',
  styleUrls: ['./phone-type-form.component.css']
})
export class PhoneTypeFormComponent implements OnInit {

  phoneTypeFormGroup: FormGroup;

  @Input() phoneType: string;

  selectedCountryCode = 'us';
  countryCodes = ['us', 'ca', 'de', 'mx', 'br', 'pt', 'cn', 'be', 'jp', 'ph', 'lu', 'bs'];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.phoneTypeFormGroup = this.fb.group({
      'phoneType': [this.phoneType],
      'phone': ['', [Validators.pattern('[A-Za-z0-9\-\_ ()]+')]]
    });
  }

  changeSelectedCountryCode(value: string): void {
    this.selectedCountryCode = value;
  }

}
