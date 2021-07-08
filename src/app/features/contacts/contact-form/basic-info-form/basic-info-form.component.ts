import { Component, OnInit, Input } from '@angular/core';
import { ValidationErrors, FormGroup, ValidatorFn, AsyncValidatorFn, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { contactStatuses } from '../../constants/contact-status';
import { linesOfBusiness } from '../../constants/line-of-business';
import { Contact } from '../../models/contact';
import { Observable, of } from 'rxjs';
import { map, delay, switchMap, startWith } from 'rxjs/operators';
import { DisplayValueMap } from '../../../../models/name-value-map';
import { ContactService } from '../../services/contact.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { GeoService } from 'carey-geo';
import { DateService } from '../../../../services/date.service';
import { Account } from '../../../accounts/models/account';
import { AccountService } from '../../../accounts/services/account.service';
import { sources } from '../../../../models/source';


@Component({
  selector: 'contact-basic-info-form',
  templateUrl: './basic-info-form.component.html',
  styleUrls: ['./basic-info-form.component.css']
})
export class BasicInfoFormComponent implements OnInit {

  basicInfoFormGroup: FormGroup;
  originalFormState: Contact;

  availableSources: DisplayValueMap[] = sources;
  availableContactStatuses: DisplayValueMap[] = contactStatuses;
  availableLinesOfBusiness: DisplayValueMap[] = linesOfBusiness;
  availableMonths: string[] = [];

  availableAccounts: Account[] = [{ name: "Loading...", id: "-1" } as Account];
  filteredAccounts: Observable<Account[]> = of(this.availableAccounts);
  newAccount: boolean = false;

  availableTimezones: string[] = ['Loading...'];
  filteredTimezones: Observable<string[]> = of(this.availableTimezones);

  daysInMonth: number[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;

  @Input() contact: Contact;

  constructor(private fb: FormBuilder, private contactService: ContactService,
    private accountService: AccountService, private geoService: GeoService, private dateService: DateService) { }

  ngOnInit() {
    this.createForm();
    this.loadData();
    this.saveForm();
  }

  private loadData() {
    this.loadAccounts();
    this.loadTimezones();
  }

  private loadAccounts() {
    this.accountService.fetchAllAccounts().subscribe(
      (accounts: Account[]) => this.handleFetchAccountsResponse(accounts),
      err => this.handleFetchAccountsError(err)
    );
  }

  private loadTimezones() {
    this.geoService.fetchAllTimezones().subscribe(
      (zones: string[]) => this.handleFetchTimezonesResponse(zones),
      err => this.handleFetchTimezonesError(err)
    )
  }

  private handleFetchTimezonesResponse(zones: string[]) {
    this.availableTimezones = zones;

    this.filteredTimezones = this.basicInfoFormGroup.controls['timezone'].valueChanges.pipe(
      startWith(''),
      map(value => this.filterTimezone(value))
    );
  }

  private handleFetchTimezonesError(err: Error) {
    console.error("Problem fetching time zones!");
  }

  private handleFetchAccountsResponse(accounts: Account[]) {
    this.availableAccounts = accounts;

    this.filteredAccounts = this.basicInfoFormGroup.controls['account'].valueChanges.pipe(
      startWith(''),
      map(value => this.filterAccount(value))
    );
  }

  private filterAccount(name: string): Account[] {
    const filterValue = name.toLowerCase();
    return this.availableAccounts.filter(account => account.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private filterTimezone(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.availableTimezones.filter(zone => zone.toLowerCase().indexOf(filterValue) === 0);
  }

  private handleFetchAccountsError(err: Error) {
    console.log(err);
  }

  getDaysInMonth() {
    let month: string = this.basicInfoFormGroup.controls['birthdayMonth'].value;

    if (month) {
      let days: number = this.dateService.getNumberOfDaysInMonth(month);
      this.daysInMonth = [];

      for (let i = 1; i <= days; i++) {
        this.daysInMonth.push(i);
      }
    }
  }

  private saveForm() {
    this.originalFormState = this.basicInfoFormGroup.getRawValue();
  }

  private createForm() {
    if (!this.contact) this.contact = { 'status': 'NEW', 'authority': false } as Contact;

    let authority: string = this.contact.authority ? 'true' : 'false';
    let canCall: string = this.contact.canCall ? 'true' : 'false';
    let canText: string = this.contact.canText ? 'true' : 'false';
    let canEmail: string = this.contact.canEmail ? 'true' : 'false';

    this.availableMonths = this.dateService.getAvailableMonths();

    this.basicInfoFormGroup = this.fb.group({
      'firstName': [this.contact.firstName, [Validators.required, Validators.pattern('^[a-zA-Z. \-\]*$')]],
      'lastName': [this.contact.lastName, [Validators.required, Validators.pattern('^[a-zA-Z. \-\]*$')]],
      'email': [this.contact.email, [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      [this.emailExistsValidator()],
        'blur'
      ],
      'source': [this.contact.source, [Validators.required]],
      'sourceDetails': [this.contact.sourceDetails, [Validators.pattern('^[a-zA-Z0-9., \-\]*$')]],
      'status': [this.contact.status, [Validators.required]],
      'lineOfBusiness': [this.contact.linesOfBusiness],
      'authority': [authority],
      'title': [this.contact.title, [Validators.pattern('^[a-zA-Z. \-\]*$')]],
      'account': [(this.contact.account ? this.contact.account.name : ''),
        [this.accountValidator(), Validators.required, Validators.pattern('^[a-zA-Z., \-\]*$')]],
      'timezone': [this.contact.timezone],
      'birthdayDay': [this.contact.birthdayDay],
      'birthdayMonth': [this.contact.birthdayMonth],
      'canCall': [canCall],
      'canText': [canText],
      'canEmail': [canEmail],
      'tags': [(this.contact.tags) ? this.contact.tags : []],
      'notes': [this.contact.notes, [Validators.pattern('^[a-zA-Z0-9., \-\]*$')]]
    });
  }

  private accountValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == 'Loading...') {
        return { 'invalid': true };
      } 

      this.getAccount(control.value); 

      return null;
    };
  }

  private emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!this.contact.id) {
        //if we get here it's a new contact
        return this.checkEmail(control);
      } else {
        //if the user has an ID, that means a duplicate email is okay - it could be the
        //user's original email address
        if (this.originalFormState && this.originalFormState.email == control.value) {
          //if we get here the user has the same email address as always - no conflict
          return of(null);
        } else {
          //the user changed the email address - need to check
          return this.checkEmail(control);
        }
      }
    };
  }

  private checkEmail(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.value && (<string>control.value).trim().length > 0) {
      return of(control.value).pipe(
        delay(500),
        switchMap((email) => this.contactService.doesEmailExist(email).pipe(
          map(emailExists => emailExists ? { emailExists: true } : null)
        ))
      );
    } else {
      return of(null);
    }
  }

  leftAccountField() {
    this.newAccount = false;
    let account: Account = this.getAccount(this.basicInfoFormGroup.controls['account'].value);

    this.newAccount = (account && !account.id);
  }

  populateContact(contact: Contact) {
    let basicInfo: FormGroup = this.basicInfoFormGroup;

    contact.authority = (basicInfo.controls['authority'].value == 'true');
    contact.account = this.getAccount(basicInfo.controls['account'].value);
    contact.email = basicInfo.controls['email'].value;
    contact.firstName = basicInfo.controls['firstName'].value;
    contact.lastName = basicInfo.controls['lastName'].value;
    contact.linesOfBusiness = basicInfo.controls['lineOfBusiness'].value;
    contact.source = basicInfo.controls['source'].value;
    contact.sourceDetails = basicInfo.controls['sourceDetails'].value;
    contact.status = basicInfo.controls['status'].value;
    contact.title = basicInfo.controls['title'].value;
    contact.tags = basicInfo.controls['tags'].value;
    contact.timezone = basicInfo.controls['timezone'].value;
    contact.canCall = (basicInfo.controls['canCall'].value == 'true');
    contact.canText = (basicInfo.controls['canText'].value == 'true');
    contact.canEmail = (basicInfo.controls['canEmail'].value == 'true');
    contact.birthdayDay = basicInfo.controls['birthdayDay'].value;
    contact.birthdayMonth = basicInfo.controls['birthdayMonth'].value;
    contact.notes = basicInfo.controls['notes'].value;
  }

  private getAccount(accountName: string): Account {
    let account: Account = null;

    if (accountName && typeof (accountName) === 'string') {
      account = this.availableAccounts.find(a => a.name.toLowerCase() == accountName.toLowerCase());

      if (!account) {
        account = { name: accountName, id: null } as Account;
      }
    }

    return account;
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (value.length < 21) {
        this.basicInfoFormGroup.controls['tags'].setValue([...this.basicInfoFormGroup.controls['tags'].value, value.trim()]);
        this.basicInfoFormGroup.controls['tags'].updateValueAndValidity();
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.basicInfoFormGroup.controls['tags'].value.indexOf(tag);

    if (index >= 0) {
      this.basicInfoFormGroup.controls['tags'].value.splice(index, 1);
      this.basicInfoFormGroup.controls['tags'].updateValueAndValidity();
    }
  }
}

