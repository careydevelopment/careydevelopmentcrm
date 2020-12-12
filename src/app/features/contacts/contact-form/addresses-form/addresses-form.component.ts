import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addressTypes } from '../../constants/address-type';
import { Address } from '../../models/address';
import { Contact } from '../../models/contact';
import { AddressTypeFormComponent } from './address-type-form/address-type-form.component';

@Component({
  selector: 'contact-addresses-form',
  templateUrl: './addresses-form.component.html',
  styleUrls: ['./addresses-form.component.css']
})
export class AddressesFormComponent implements OnInit {

  @ViewChildren(AddressTypeFormComponent) addressTypeComponents: AddressTypeFormComponent[];

  availableAddressTypes = addressTypes;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  populateContact(contact: Contact) {
    let addresses: Address[] = [];

    this.addressTypeComponents.forEach((element, index) => {
      let address = {} as Address;
      let addressForm: FormGroup = element.addressTypeFormGroup;

      address.addressType = addressForm.controls['addressType'].value.trim();
      address.city = addressForm.controls['city'].value.trim();
      address.country = addressForm.controls['country'].value.trim();
      address.state = addressForm.controls['state'].value.trim();
      address.street1 = addressForm.controls['street1'].value.trim();
      address.street2 = addressForm.controls['street2'].value.trim();
      address.zip = addressForm.controls['zip'].value.trim();

      if (address.city.length > 0 || address.country.length > 0 || address.state.length > 0) {
        addresses.push(address);
      }
    });

    contact.addresses = addresses;
  }
}
