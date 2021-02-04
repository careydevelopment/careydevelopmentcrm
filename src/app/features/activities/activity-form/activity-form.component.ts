import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Contact } from '../../contacts/models/contact';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../ui/alert/alert.service';
import { ContactService } from '../../service/contact.service';
import { DropdownService } from '../../ui/service/dropdown.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationErrors, FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Activity } from '../models/activity';
import { ActivityType } from '../models/activity-type';
import { ActivityService } from '../service/activity.service';
import { ActivityOutcome } from '../models/activity-outcome';
import { DateService } from '../../../services/date.service';

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
    private fb: FormBuilder, private activityService: ActivityService, private dateService: DateService) { }

  ngOnInit(): void {
    this.loadData();
    this.createForm();
    this.intitializeCalendars();
  }

  private intitializeCalendars() {
    this.activityFormGroup.get('startDate').setValue(new Date());
    this.activityFormGroup.get('startDate').enable();

    this.activityFormGroup.get('endDate').setValue(new Date());
    this.activityFormGroup.get('endDate').enable();

    this.startDateChanged();
    this.endDateChanged();

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
    } else {
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
    console.log(err);

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
    console.log(err);

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
      'title': [this.activity.title, [Validators.pattern('^[a-zA-Z \-\]*$')]],
      'location': [this.activity.location, [Validators.pattern('^[a-zA-Z \-\]*$')]],
      'startDate': [null],
      'startHour': [12],
      'startMinute': [0],
      'startMeridian': ['AM'],
      'endDate': [null],
      'endHour': [12],
      'endMinute': [0],
      'endMeridian': ['AM'],
      'contact': ['', [Validators.required]],
      'outcome': ['']
    });
  }

  private setCalendarInputs() {
    let date = new Date();
    date.setTime(this.currentStartDate);
    this.setHoursAndMinutes(date, 'start');

    date.setTime(this.currentEndDate);
    this.setHoursAndMinutes(date, 'end');
  }

  private setHoursAndMinutes(date: Date, type: string) {
    let hour = date.getHours();

    if (hour > 11) {
      hour -= 12;
      this.activityFormGroup.controls[type + 'Meridian'].setValue('PM');
    } else {
      this.activityFormGroup.controls[type + 'Meridian'].setValue('AM');
    }

    if (date.getMinutes() > 52) hour += 1;
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

  startDateChanged() {
    let date: string = this.activityFormGroup.controls['startDate'].value;
    let hour: string = this.activityFormGroup.controls['startHour'].value;
    let minute: string = this.activityFormGroup.controls['startMinute'].value;
    let meridian: string = this.activityFormGroup.controls['startMeridian'].value;

    let newDateVal: number = this.dateService.getDateVal(date, hour, minute, meridian);

    let disp: string = this.dateService.getShortDateAndTimeDisplay(newDateVal);
    console.log(disp);
    this.currentStartDate = newDateVal;
  }

  endDateChanged() {
    let date: string = this.activityFormGroup.controls['endDate'].value;
    let hour: string = this.activityFormGroup.controls['endHour'].value;
    let minute: string = this.activityFormGroup.controls['endMinute'].value;
    let meridian: string = this.activityFormGroup.controls['endMeridian'].value;

    let newDateVal: number = this.dateService.getDateVal(date, hour, minute, meridian);

    let disp: string = this.dateService.getShortDateAndTimeDisplay(newDateVal);
    console.log(disp);
    this.currentEndDate = newDateVal;
  }

}
