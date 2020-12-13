import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../../../../models/country';
import { State } from '../../../../../models/state';
import { GeoService } from '../../../../../services/geo.service';

@Component({
  selector: 'contact-address-type-form',
  templateUrl: './address-type-form.component.html',
  styleUrls: ['./address-type-form.component.css']
})
export class AddressTypeFormComponent implements OnInit {

  addressTypeFormGroup: FormGroup;

  @Input() addressType: string;

  states: State[] = [];
  countries: Country[] = [];

  dataLoading: boolean = true;

  constructor(private fb: FormBuilder, private geoService: GeoService) { }

  ngOnInit() {
    this.initGeos();
    this.initForm();
  }

  private initForm() {
    this.addressTypeFormGroup = this.fb.group({
      'addressType': [this.addressType],
      'street1': ['', [Validators.pattern('^[a-zA-Z0-9, \-\']+')]],
      'street2': ['', [Validators.pattern('^[a-zA-Z0-9, \-\']+')]],
      'city': ['', [Validators.pattern('^[a-zA-Z0-9, \-\']+')]],
      'state': [''],
      'zip': [''],
      'country': ['US']
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
