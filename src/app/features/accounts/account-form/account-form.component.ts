import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'carey-alert';
import { Country, GeoService, State } from 'carey-geo';
import { forkJoin, Observable } from 'rxjs';
import { Address } from '../../../models/address';
import { DisplayValueMap } from '../../../models/name-value-map';
import { Phone } from '../../../models/phone';
import { sources } from '../../../models/source';
import { accountStatuses } from '../constants/account-status';
import { industries } from '../constants/industry';
import { Account } from '../models/account';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {

  accountInfoFormGroup: FormGroup;

  availableSources: DisplayValueMap[] = sources;
  availableAccountStatuses: DisplayValueMap[] = accountStatuses;
  availableIndustries: DisplayValueMap[] = industries;

  @Input() account: Account;

  selectedCountryCode = 'us';
  phoneCode = '1';
  countryCodes = ['us', 'ca', 'de', 'mx', 'br', 'pt', 'cn', 'be', 'jp', 'ph', 'lu', 'bs'];

  dataLoading: boolean = true;

  states: State[] = [];
  countries: Country[] = [];

  pageTitle: string = 'Add Account';

  constructor(private fb: FormBuilder, private geoService: GeoService,
    private accountService: AccountService, private alertService: AlertService,
    private router: Router) { }

  ngOnInit(): void {
    this.initializeAccount();
    this.setTitle();
    this.initGeos();
    this.createForm();
  }

  private setTitle() {
    if (this.account) this.pageTitle = 'Edit Account';
  }

  private initializeAccount() {
    if (!this.account) this.account = {} as Account;

    if (!this.account.address) this.account.address = {} as Address;
    if (!this.account.phone) this.account.phone = {} as Phone;
  }

  private createForm() {
    this.accountInfoFormGroup = this.fb.group({
      'name': [this.account.name, [Validators.required, Validators.pattern('^[a-zA-Z., \-\]*$')]],
      'industry': [this.account.industry],
      'description': [this.account.description, [Validators.pattern('^[a-zA-Z., \-\]*$')]],
      'numberOfEmployees': [this.account.numberOfEmployees],
      'stockSymbol': [this.account.stockSymbol],
      'annualRevenue': [this.account.annualRevenue],
      'status': [this.account.status],
      'source': [this.account.source],
      'street1': [this.account.address.street1, [Validators.pattern('^[a-zA-Z0-9., \-\']+')]],
      'street2': [this.account.address.street2, [Validators.pattern('^[a-zA-Z0-9., \-\']+')]],
      'city': [this.account.address.city, [Validators.pattern('^[a-zA-Z., \-\']+')]],
      'state': [this.account.address.state],
      'zip': [this.account.address.zip],
      'country': [(this.account.address.country)],
      'phone': [(this.account.phone.phone)]
    });
  }

  populateAccount() {
    let formControls = this.accountInfoFormGroup.controls;

    this.account.annualRevenue = formControls['annualRevenue'].value;
    this.account.description = formControls['description'].value;
    this.account.industry = formControls['industry'].value;
    this.account.name = formControls['name'].value;
    this.account.numberOfEmployees = formControls['numberOfEmployees'].value;
    this.account.source = formControls['source'].value;
    this.account.status = formControls['status'].value;
    this.account.stockSymbol = formControls['stockSymbol'].value;

    this.setAddress();
    this.setPhone();
  }

  private setAddress() {
    let formControls = this.accountInfoFormGroup.controls;
    let address: Address = {} as Address;

    address.addressType = 'BUSINESS';
    address.city = formControls['city'].value;
    address.country = formControls['country'].value;
    address.state = formControls['state'].value;
    address.street1 = formControls['street1'].value;
    address.street2 = formControls['street2'].value;
    address.zip = formControls['zip'].value;

    this.account.address = address;
  }

  private setPhone() {
    let formControls = this.accountInfoFormGroup.controls;
    let phone: Phone = {} as Phone;

    phone.phoneType = 'BUSINESS';
    phone.phone = formControls['phone'].value;
    phone.countryCode = this.selectedCountryCode;

    this.account.phone = phone;
  }

  changeSelectedCountryCode(value: string): void {
    this.selectedCountryCode = value;
    this.phoneCode = this.geoService.findCountryCodeByTwoLetterAbbreviation(this.selectedCountryCode);
  }

  saveForm() {
    this.alertService.clear();
    this.populateAccount();
    console.log(this.account);
    if (this.account.id) this.updateAccount();
    else this.createAccount();
  }

  private updateAccount() {
    this.accountService.updateAccount(this.account).subscribe(
      (account: Account) => this.handleAccountSaveResponse(account),
      (err) => this.handleAccountSaveError(err)
    )
  }

  private createAccount() {
    this.accountService.createAccount(this.account).subscribe(
      (account: Account) => this.handleAccountSaveResponse(account),
      (err) => this.handleAccountSaveError(err)
    )
  }

  private handleAccountSaveResponse(account: Account) {
    this.alertService.success("Account successfully saved!", { keepAfterRouteChange: true });
    let route = '/accounts/view-account';
    this.router.navigate([route], { queryParams: { id: account.id } });
  }

  private handleAccountSaveError(err: Error) {
    console.error(err);
    this.alertService.error("Problem saving account!");
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

  private scrollToTop() {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
  }
}
