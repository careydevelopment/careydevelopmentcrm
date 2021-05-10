import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, State, GeoService } from 'carey-geo';
import { Address } from '../../../models/address';
import { Contact } from '../../../models/contact';

@Component({
  selector: 'contact-address-type-form',
  templateUrl: './address-type-form.component.html',
  styleUrls: ['./address-type-form.component.css']
})
export class AddressTypeFormComponent implements OnInit {

  addressTypeFormGroup: FormGroup;

  @Input() addressType: string;
  @Input() contact: Contact;

  states: State[] = [];
  countries: Country[] = [];

  dataLoading: boolean = true;

  constructor(private fb: FormBuilder, private geoService: GeoService) { }

  ngOnInit() {
    this.initGeos();
    this.initForm();
  }

  private initForm() {
    if (!this.contact) this.contact = {} as Contact;

    let address: Address = (this.contact.addresses) ? this.contact.addresses.find(ad => ad.addressType === this.addressType) : null;
    if (!address) address = {} as Address;
    
    this.addressTypeFormGroup = this.fb.group({
      'addressType': [this.addressType],
      'street1': [address.street1, [Validators.pattern('^[a-zA-Z0-9, \-\']+')]],
      'street2': [address.street2, [Validators.pattern('^[a-zA-Z0-9, \-\']+')]],
      'city': [address.city, [Validators.pattern('^[a-zA-Z0-9, \-\']+')]],
      'state': [address.state],
      'zip': [address.zip],
      'country': [address.country]
    });
  }

  private initGeos() {
    this.countries = this.geoService.allCountries;
    this.states = this.geoService.allStates;

    if (!this.countries || !this.states) {
      this.loadGeos();
    } else {
      this.dataLoading = false;
    }
  }

  private loadGeos() {
    this.geoService.initializeAllStates()
      .subscribe(
        (states: State[]) => this.handleStateResponse(states),
        err => this.handleGeoError(err)
      );

    this.geoService.initializeAllCountries()
      .subscribe(
        (countries: Country[]) => this.handleCountryResponse(countries),
        err => this.handleGeoError(err)
      );
  }

  private handleStateResponse(states: State[]) {
    this.states = states;
    if (this.states && this.countries) this.dataLoading = false;
  }

  private handleCountryResponse(countries: Country[]) {
    this.countries = countries;
    if (this.states && this.countries) this.dataLoading = false;
  }

  private handleGeoError(err: Error) {
    console.error("Problem getting geographies!", err);
  }

}
