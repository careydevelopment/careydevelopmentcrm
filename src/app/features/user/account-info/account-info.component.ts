import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Country, State, GeoService } from 'carey-geo';
import { User, UserService } from 'carey-user';
import { AlertService } from 'carey-alert';


@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  form: FormGroup;

  states: State[] = [];
  countries: Country[] = [];
  timezones: string[] = [];

  formSubmitted: boolean = false;
  user: User = {} as User;
  dataLoading: boolean = true;

  constructor(private fb: FormBuilder, private geoService: GeoService,
    private userService: UserService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.initGeos();
    this.initForm();
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
    this.geoService.fetchAllStates()
      .subscribe(
        (states: State[]) => this.handleStateResponse(states),
        err => this.handleGeoError(err)
      );

    this.geoService.fetchAllCountries()
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

  private initForm() {
    this.user = this.userService.user;
    if (!this.user) this.user = {} as User;

    this.form = this.fb.group({
      'firstName': [this.user.firstName, Validators.compose([Validators.required])],
      'lastName': [this.user.lastName, Validators.compose([Validators.required])],
      'street1': [this.user.street1, Validators.compose([Validators.required, Validators.minLength(4)])],
      'street2': [this.user.street2],
      'city': [this.user.city, Validators.compose([Validators.required])],
      'state': [this.user.state, Validators.compose([Validators.required])],
      'zip': [this.user.zip, Validators.compose([Validators.required, Validators.minLength(5)])],
      'country': [this.user.country, Validators.compose([Validators.required])],
      'email': [this.user.email, Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")])],
      'phoneNumber': [this.user.phoneNumber, Validators.compose([Validators.required, Validators.minLength(5)])]
    });
  }

  update() {
    this.formSubmitted = true;
    console.log("Clearing alerts");
    this.alertService.clear();

    let userToSubmit: User = this.createUserToSubmit();

    this.userService.update(this.user.id, userToSubmit)
      .subscribe(
        (updatedUser: User) => this.handleUserUpdateResponse(updatedUser),
        err => this.handleUserUpdateError(err)
      );
  }

  private handleUserUpdateResponse(updatedUser: User) {
    if (updatedUser) {
      this.user = updatedUser;
      this.alertService.success("User info successfully updated!");
      this.scrollToTop();
    }

    this.formSubmitted = false;
  }

  private handleUserUpdateError(err: Error) {
    console.error("Problem updating user!", err);
    this.alertService.error("Problem updating user info!");
    this.scrollToTop()
    this.formSubmitted = false;

    this.showServerSideErrors(err);
  }

  private showServerSideErrors(err: Error) {
    if (err instanceof HttpErrorResponse) {
      let httpError: HttpErrorResponse = <HttpErrorResponse>err;

      if (httpError.error && httpError.error.errors) {
        let allErrors = httpError.error.errors;

        for (let i = 0; i < allErrors.length; i++) {
          let currentError = allErrors[i];
          this.form.controls[currentError.field].setErrors({ 'incorrect': true });
        }
      }

      this.form.markAllAsTouched();
    }
  }

  private scrollToTop() {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
  }

  private createUserToSubmit(): User {
    let userToSubmit: User = {} as User;

    userToSubmit.city = this.form.controls['city'].value;
    userToSubmit.email = this.form.controls['email'].value;
    userToSubmit.firstName = this.form.controls['firstName'].value;
    userToSubmit.lastName = this.form.controls['lastName'].value;
    userToSubmit.phoneNumber = this.form.controls['phoneNumber'].value;
    userToSubmit.state = this.form.controls['state'].value;
    userToSubmit.street1 = this.form.controls['street1'].value;
    userToSubmit.street2 = this.form.controls['street2'].value;
    userToSubmit.zip = this.form.controls['zip'].value;
    userToSubmit.country = this.form.controls['country'].value;

    //add back data not shown on the form
    userToSubmit.id = this.user.id;
    userToSubmit.authorityNames = this.user.authorityNames;
    userToSubmit.username = this.user.username;

    return userToSubmit;
  }
}
