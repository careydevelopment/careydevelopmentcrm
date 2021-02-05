import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Contact } from '../../contacts/models/contact';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../ui/alert/alert.service';
import { ContactService } from '../../service/contact.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationErrors, FormControl, ValidatorFn, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Activity } from '../models/activity';
import { ActivityType } from '../models/activity-type';
import { ActivityService } from '../service/activity.service';
import { ActivityOutcome } from '../models/activity-outcome';
import { DateService } from '../../../services/date.service';
import { FormService } from '../../../services/form.service';
import { AccountLightweight } from '../models/account-lightweight';
import { ContactLightweight } from '../models/contact-lightweight';
import { ActivityTypeLightweight } from '../models/activity-type-lightweight';

//5 years
const maximumTimeSpan: number = 5 * 365 * 24 * 60 * 60 * 1000;

//1 week
const maxAppointmentLength: number = 7 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-activity-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  contact: Contact;
  loading: boolean = true;
  pageTitle: string = 'Add Activity';
  activity: Activity = <Activity>{};
  loadingActivityType: ActivityType = <ActivityType>{ name: 'Loading...' };
  selectedActivityType: ActivityType;
  contacts: Contact[];

  currentStartDate: number = -1;
  currentEndDate: number = -1;

  addingForContact: boolean = false;
  addingActivityType: boolean = false;

  activityFormGroup: FormGroup;

  availableActivityTypes: ActivityType[] = [this.loadingActivityType];
  availableActivityOutcomes: ActivityOutcome[] = [];

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private router: Router,
    private fb: FormBuilder, private activityService: ActivityService,
    private dateService: DateService, private formService: FormService) { }

  ngOnInit(): void {
    this.loadData();
    this.createForm();
    this.intitializeCalendars();
  }

  private intitializeCalendars() {
    let currentDate: Date = new Date();
    let endDate: Date = new Date(currentDate.getTime() + (60 * 60 * 1000));

    this.activityFormGroup.get('startDate').setValue(currentDate);
    this.activityFormGroup.get('startDate').enable();

    this.activityFormGroup.get('endDate').setValue(endDate);
    this.activityFormGroup.get('endDate').enable();

    this.currentEndDate = endDate.getTime();
    this.currentStartDate = currentDate.getTime();

    this.setCalendarInputs();
  }

  private loadData() {
    this.checkForContact();
    this.checkForActivityType();
  }

  private checkForActivityType() {
    this.loadActivityTypes();
  }

  private checkForContact() {
    if (this.route.snapshot.queryParams['contactId']) {
      this.addingForContact = true;
      this.loadContact();
    } else {
      this.loading = false;
      this.loadContacts();
    }
  }

  private loadActivityTypes() {
    this.activityService.fetchAllActivityTypes().subscribe(
      (activityTypes: ActivityType[]) => this.handleActivityTypesResponse(activityTypes),
      err => this.handleActivityTypesError(err)
    );
  }

  private handleActivityTypesResponse(activityTypes: ActivityType[]) {
    this.availableActivityTypes = activityTypes;

    if (this.route.snapshot.queryParams['activityTypeId']) {
      this.addingActivityType = true;
    } 
  }

  private handleActivityTypesError(err: Error) {
    console.error(err);
  }

  private loadContacts() {
    let contacts$ = this.contactService.fetchMyContacts();

    contacts$.subscribe(
      (contacts: Contact[]) => this.handleContactsResponse(contacts),
      err => this.handleContactsError(err)
    );
  }

  private handleContactsResponse(contacts: Contact[]) {
    this.contacts = contacts;
  }

  private handleContactsError(err: Error) {
    console.error(err);

    let alertMessage: string = 'Something went wrong, please call support';

    this.alertService.error(alertMessage);
  }

  private loadContact() {
    let contact$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.contactService.fetchById(params.get('contactId')))
    );

    contact$.subscribe(
      (contact: Contact) => this.handleContactResponse(contact),
      err => this.handleContactError(err)
    );
  }

  private handleContactResponse(contact: Contact) {
    this.contact = contact;
    this.loading = false;
  }

  private handleContactError(err: Error) {
    this.loading = false;
    console.error(err);

    let alertMessage: string = 'Something went wrong, please call support';

    if (err instanceof HttpErrorResponse) {
      if (err.status) {
        if (err.status == 404) {
          alertMessage = 'Contact with that ID does not exist';
        }
      }
    }

    this.alertService.error(alertMessage);
  }

  private createForm() {
    this.activityFormGroup = this.fb.group({
      'type': [this.activity.type, [Validators.required]],
      'title': [this.activity.title, [Validators.required, Validators.pattern('^[a-zA-Z \-\]*$')]],
      'location': [this.activity.location, [Validators.pattern('^[a-zA-Z \-\]*$')]],
      'startDate': [null, [this.startDateValidator()]],
      'startHour': [12],
      'startMinute': [0],
      'startMeridian': ['AM'],
      'endDate': [null, [this.endDateValidator()]],
      'endHour': [12],
      'endMinute': [0],
      'endMeridian': ['AM'],
      'contact': ['', [Validators.required]],
      'outcome': [''],
      'notes': [this.activity.notes, [Validators.pattern('^[a-zA-Z \-\]*$')]]
    });
  }

  private startDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      this.startDateChanged();
      this.endDateChanged();

      if (this.selectedActivityType) {
        if (!control.value || control.value.toString().trim() == '') {
          return { 'invalid': true };
        } else {
          let today: number = Date.now();
          let difference = Math.abs(today - this.currentStartDate);
          if (difference > maximumTimeSpan) {
            return { 'threshold': true };
          }
        }
      }

      return null;
    };
  }

  private endDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      this.startDateChanged();
      this.endDateChanged();

      if (this.selectedActivityType && this.selectedActivityType.usesEndDate) {
        if (!control.value || control.value.toString().trim() == '') {
          return { 'invalid': true };
        } else if (this.currentStartDate > this.currentEndDate) {
          return { 'sequence': true };
        } else if (Math.abs(this.currentStartDate - this.currentEndDate) > maxAppointmentLength) {
          return { 'maxAppointmentLength' : true };
        }
      }

      return null;
    };
  }

  private setCalendarInputs() {
    let currentDate = new Date();
    currentDate.setTime(this.currentStartDate);
    this.setHoursAndMinutes(currentDate, 'start');

    let endDate = new Date();
    endDate.setTime(this.currentEndDate);
    this.setHoursAndMinutes(endDate, 'end');
  }

  private setHoursAndMinutes(date: Date, type: string) {
    let hour = date.getHours();
    if (date.getMinutes() > 52) hour += 1;

    if (hour > 11) {
      this.activityFormGroup.controls[type + 'Meridian'].setValue('PM');
    } else {
      this.activityFormGroup.controls[type + 'Meridian'].setValue('AM');
    }

    if (hour > 12) {
      hour -= 12;
    }

    let minutes = this.dateService.roundToNearest15Minutes(date.getMinutes());

    this.activityFormGroup.controls[type + 'Hour'].setValue(hour);
    this.activityFormGroup.controls[type + 'Minute'].setValue(minutes);
  }

  activityTypeChanged(name: string) {
    if (this.availableActivityTypes && name) {
      this.selectedActivityType = this.availableActivityTypes.find(type => type.name === name);
      this.availableActivityOutcomes = this.selectedActivityType.possibleOutcomes;
    }

    this.setCalendarInputs();
  }

  contactChanged(id: string) {
    if (this.contacts && id) {
      this.contact = this.contacts.find(contact => contact.id === id);
    }
  }

  startDateChanged() {
    if (this.activityFormGroup) {
      let date: string = this.activityFormGroup.controls['startDate'].value;
      let hour: number = this.activityFormGroup.controls['startHour'].value;
      let minute: number = this.activityFormGroup.controls['startMinute'].value;
      let meridian: string = this.activityFormGroup.controls['startMeridian'].value;

      let newDateVal: number = this.dateService.getDateVal(date, hour, minute, meridian);

      this.currentStartDate = newDateVal;
    }
  }

  endDateChanged() {
    if (this.activityFormGroup) {
      let date: string = this.activityFormGroup.controls['endDate'].value;
      let hour: number = this.activityFormGroup.controls['endHour'].value;
      let minute: number = this.activityFormGroup.controls['endMinute'].value;
      let meridian: string = this.activityFormGroup.controls['endMeridian'].value;

      let newDateVal: number = this.dateService.getDateVal(date, hour, minute, meridian);

      this.currentEndDate = newDateVal;
    }
  }

  isDateInPast(): boolean {
    let inPast: boolean = false;

    if (this.selectedActivityType) {
      if (this.selectedActivityType.usesEndDate) {
        if (this.currentEndDate > -1) {
          if (this.currentEndDate < new Date().getTime()) {
            inPast = true;
          }
        }
      } else {
        if (this.currentStartDate > -1) {
          if (this.currentStartDate < new Date().getTime()) {
            inPast = true;
          }
        }
      }
    }

    return inPast;
  }

  saveActivity() {
    this.alertService.clear();

    //force all fields to validate one more time just to be sure
    Object.keys(this.activityFormGroup.controls).forEach(field => {
      const control = this.activityFormGroup.get(field);
      control.updateValueAndValidity();
    });

    if (this.formService.formHasErrors(this.activityFormGroup)) {
      this.alertService.error("Form contains errors. See below.");
      this.scrollToTop();
    } else {
      this.setActivity();
    }
  }

  private setActivity() {
    let account: AccountLightweight = { id: this.contact.account.id, name: this.contact.account.name };
    let contact: ContactLightweight = { id: this.contact.id, firstName: this.contact.firstName, lastName: this.contact.lastName, account: account };
    let activityType: ActivityTypeLightweight = { id: this.selectedActivityType.id, name: this.selectedActivityType.name, icon: this.selectedActivityType.icon };
    let outcome: ActivityOutcome = this.availableActivityOutcomes.find(outcome => outcome.id == this.activityFormGroup.controls['outcome'].value);

    this.activity.contact = contact;
    this.activity.location = this.activityFormGroup.controls['location'].value;
    this.activity.notes = this.activityFormGroup.controls['notes'].value;
    this.activity.outcome = outcome;
    this.activity.startDate = this.currentStartDate;
    this.activity.title = this.activityFormGroup.controls['title'].value;
    this.activity.type = activityType;
    
    if (this.selectedActivityType.usesEndDate) this.activity.endDate = this.currentEndDate;

    console.log("activity is ", this.activity);
  }

  private scrollToTop() {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
  }
}
