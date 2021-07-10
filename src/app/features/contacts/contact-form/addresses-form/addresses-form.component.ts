import { Component, OnInit, ViewChildren, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Address } from '../../../../models/address';
import { addressTypes } from '../../../../models/address-type';
import { Contact } from '../../models/contact';
import { AddressTypeFormComponent } from './address-type-form/address-type-form.component';

@Component({
  selector: 'contact-addresses-form',
  templateUrl: './addresses-form.component.html',
  styleUrls: ['./addresses-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddressesFormComponent implements OnInit {

  @ViewChildren(AddressTypeFormComponent) addressTypeComponents: AddressTypeFormComponent[];

  @Input() contact: Contact;

  availableAddressTypes = addressTypes;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  populateContact(contact: Contact) {
    let addresses: Address[] = [];

    this.addressTypeComponents.forEach((element, index) => {
      let address = {} as Address;
      let addressForm: FormGroup = element.addressTypeFormGroup;

      address.addressType = addressForm.controls['addressType'].value;
      address.city = addressForm.controls['city'].value;
      address.country = addressForm.controls['country'].value;
      address.state = addressForm.controls['state'].value;
      address.street1 = addressForm.controls['street1'].value;
      address.street2 = addressForm.controls['street2'].value;
      address.zip = addressForm.controls['zip'].value;

      if ((address.city && address.city.trim().length > 0)
        || (address.country && address.country.trim().length > 0)
        || (address.state && address.state.trim().length > 0)) {

        addresses.push(address);
      }
    });

    contact.addresses = addresses;
  }
}
