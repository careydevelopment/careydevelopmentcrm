import { Component, OnInit, ViewChildren, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { phoneTypes } from '../../constants/phone-type';
import { Contact } from '../../models/contact';
import { Phone } from '../../models/phone';
import { PhoneTypeFormComponent } from './phone-type-form/phone-type-form.component';


@Component({
  selector: 'contact-phones-form',
  templateUrl: './phones-form.component.html',
  styleUrls: ['./phones-form.component.css']
})
export class PhonesFormComponent implements OnInit {

  @ViewChildren(PhoneTypeFormComponent) phoneTypeComponents: PhoneTypeFormComponent[];

  availablePhoneTypes = phoneTypes;

  @Input() contact: Contact;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  populateContact(contact: Contact) {
    let phones: Phone[] = [];

    this.phoneTypeComponents.forEach((element, index) => {
      let phone = {} as Phone;
      let phoneForm: FormGroup = element.phoneTypeFormGroup;
      let countryCode: string = element.selectedCountryCode;

      phone.phoneType = phoneForm.controls['phoneType'].value;
      phone.phone = phoneForm.controls['phone'].value.trim();
      phone.countryCode = countryCode;

      if (phone.phone.length > 0) {
        phones.push(phone);
      }
    });

    contact.phones = phones;
  }
}
