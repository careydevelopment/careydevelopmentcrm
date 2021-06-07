import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, State, GeoService } from 'carey-geo';
import { forkJoin, Observable } from 'rxjs';
import { Address } from '../../../../../models/address';
import { Contact } from '../../../models/contact';

@Component({
  selector: 'contact-address-type-form',
  templateUrl: './address-type-form.component.html',
  styleUrls: ['./address-type-form.component.css'],
  encapsulation: ViewEncapsulation.None
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
      'street1': [address.street1, [Validators.pattern('^[a-zA-Z0-9., \-\']+')]],
      'street2': [address.street2, [Validators.pattern('^[a-zA-Z0-9., \-\']+')]],
      'city': [address.city, [Validators.pattern('^[a-zA-Z0-9., \-\']+')]],
      'state': [address.state],
      'zip': [address.zip],
      'country': [address.country]
    });
  }

  private initGeos() {
    let loadCountries$: Observable<Country[]> = this.geoService.fetchAllCountries();
    let loadStates$: Observable<State[]> = this.geoService.fetchAllStates();

    forkJoin([
      loadCountries$,
      loadStates$
    ]).subscribe(([allCountries, allStates]) => {
      this.handleCountryResponse(allCountries);
      this.handleStateResponse(allStates);
      this.showForm();
    },
      (err: Error) => this.handleGeoError(err)
    );
  }

  private showForm() {
    this.dataLoading = false;
  }

  private handleStateResponse(states: State[]) {
    this.states = states;
  }

  private handleCountryResponse(countries: Country[]) {
    this.countries = countries;
  }

  private handleGeoError(err: Error) {
    console.error("Problem getting geographies!", err);
  }

}
