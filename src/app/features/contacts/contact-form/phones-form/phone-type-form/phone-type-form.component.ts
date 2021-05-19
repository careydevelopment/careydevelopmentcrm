import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeoService } from 'carey-geo';
import { Phone } from '../../../../../models/phone';
import { Contact } from '../../../models/contact';

@Component({
  selector: 'contact-phone-type-form',
  templateUrl: './phone-type-form.component.html',
  styleUrls: ['./phone-type-form.component.css']
})
export class PhoneTypeFormComponent implements OnInit {

  phoneTypeFormGroup: FormGroup;

  @Input() phoneType: string;
  @Input() contact: Contact;
  
  selectedCountryCode = 'us';
  phoneCode = '1';
  countryCodes = ['us', 'ca', 'de', 'mx', 'br', 'pt', 'cn', 'be', 'jp', 'ph', 'lu', 'bs'];

  constructor(private fb: FormBuilder, private geoService: GeoService) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    if (!this.contact) this.contact = {} as Contact;

    let phone: Phone = (this.contact.phones) ? this.contact.phones.find(ph => ph.phoneType === this.phoneType) : null;
    let phoneNumber = (phone) ? phone.phone : '';

    this.phoneTypeFormGroup = this.fb.group({
      'phoneType': [this.phoneType],
      'phone': [phoneNumber, [Validators.pattern('[A-Za-z0-9\-\_ ()]+')]]
    });
  }

  changeSelectedCountryCode(value: string): void {
    this.selectedCountryCode = value;
    this.phoneCode = this.geoService.findCountryCodeByTwoLetterAbbreviation(this.selectedCountryCode);
  }

}
