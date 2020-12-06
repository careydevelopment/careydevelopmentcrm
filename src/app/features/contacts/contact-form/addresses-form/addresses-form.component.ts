import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownOption } from '../../../ui/model/dropdown-option'

@Component({
  selector: 'contact-addresses-form',
  templateUrl: './addresses-form.component.html',
  styleUrls: ['./addresses-form.component.css']
})
export class AddressesFormComponent implements OnInit {

  isLinear = false;
  addressesFormGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addressesFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });
  }


}
