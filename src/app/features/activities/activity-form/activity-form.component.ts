import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Contact } from '../../contacts/models/contact';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from 'carey-alert';
import { ValidatorFn, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Activity } from '../models/activity';
import { ActivityType } from '../models/activity-type';
import { ActivityService } from '../service/activity.service';
import { ActivityOutcome } from '../models/activity-outcome';
import { DateService } from '../../../services/date.service';
import { FormService } from '../../../services/form.service';
import { AccountLightweight } from '../models/account-lightweight';
import { ContactLightweight } from '../models/contact-lightweight';
import { ActivityTypeLightweight } from '../models/activity-type-lightweight';
import { Observable, forkJoin, of } from 'rxjs';
import { UserService } from 'carey-user';
import { SalesOwnerLightweight } from '../models/sales-owner-lightweight';
import { ContactService } from '../../contacts/services/contact.service';
import { DealLightweight } from '../../deals/models/deal-lightweight';
import { DealService } from '../../deals/service/deal.service';
import { activityStatuses } from '../constants/activity-status';
import { DisplayValueMap } from '../../../models/name-value-map';

//1 year
const maximumTimeSpan: number = 365 * 24 * 60 * 60 * 1000;

//1 week
const maxAppointmentLength: number = 7 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-activity-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  @Input() contact: Contact;
  @Input() activity: Activity;

  pageTitle: string = 'Add Activity';
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
  availableDeals: DealLightweight[] = [];
  availableStatuses: DisplayValueMap[] = activityStatuses;

  saving: boolean = false;
  loading: boolean = true;
  displayForm: boolean = false;

  prohibitedEdit: boolean = false;

  allActivityTypes$: Observable<ActivityType[]>;
  contacts$: Observable<Contact[]>;
  allDeals$: Observable<DealLightweight[]>;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private router: Router,
    private fb: FormBuilder, private activityService: ActivityService,
    private dateService: DateService, private formService: FormService,
    private userService: UserService, private dealService: DealService) { }

  ngOnInit(): void {
    this.setDefaultActivity();
    this.loadData();
    this.createForm();
    this.intitializeCalendars();
    this.handleProhibition();
  }

  private prepopulateForm() {
    if (this.addingForContact)
      this.activityFormGroup.controls['contact'].setValue(this.contact.id);

    if (this.addingActivityType) {
      this.route.queryParamMap.subscribe(
        (params: ParamMap) => this.prepopulateType(params.get('type'))
      )
    }
  }

  private prepopulateType(type: string) {
    let found: ActivityType = this.availableActivityTypes.find(activityType => activityType.name.toLowerCase() === type.toLowerCase());

    if (found) {
      this.activityFormGroup.controls['type'].setValue(found.name);
      this.activityTypeChanged(found.name);
    }
  }

  private handleProhibition() {
    if (this.prohibitedEdit) {
      this.activityFormGroup.disable();
    }
  }

  private setDefaultActivity() { 
    if (!this.activity) {
      this.activity = <Activity>{};
    } else {
      this.pageTitle = 'Edit Activity';

      if (!this.activity.type || this.activity.type.activityTypeCreator != 'USER') {
        this.alertService.error("This activity isn't editable");
        this.prohibitedEdit = true;
      } else if (!this.activity.contact || this.activity.contact.salesOwner.id != this.userService.user.id) {
        this.alertService.error("This activity isn't yours to edit");
        this.prohibitedEdit = true;
      }
    }
  }

  private intitializeCalendars() {
    if (this.activity.startDate) {
      this.initializeCalendarsForEdit();
    } else {
      this.initializeCalendarsForAdd();
    }
  }

  private initializeCalendarsForEdit() {
    let localEndDate: number = this.dateService.convertToLocal(this.activity.endDate);
    let localStartDate: number = this.dateService.convertToLocal(this.activity.startDate);

    this.currentEndDate = localEndDate;
    this.currentStartDate = localStartDate;

    this.setCalendarInputs();

    this.activityFormGroup.get('endDate').setValue(new Date(localEndDate));
    this.activityFormGroup.get('endDate').enable();

    this.activityFormGroup.get('startDate').setValue(new Date(localStartDate));
    this.activityFormGroup.get('startDate').enable();
  }

  private initializeCalendarsForAdd() {
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
    this.loadDeals();

    forkJoin([
      this.allActivityTypes$,
      this.contacts$,
      this.allDeals$
    ]).subscribe(([allActivityTypes, contacts, deals]) => {
      this.handleActivityTypesResponse(allActivityTypes);
      this.handleContactsResponse(contacts),
      this.handleDealsResponse(deals),
      this.showForm();
    },
      (err) => this.handleDataLoadError(err)
    );
  }

  private showForm() {
    this.displayForm = true;
    this.loading = false;
    this.prepopulateForm();
  }

  private checkForActivityType() {
    this.loadActivityTypes();
  }

  private checkForContact() {
    if (this.contact) {
      this.addingForContact = true;
    } 

    this.loadContacts();
  }

  private loadDeals() {
    if (this.contact && this.contact.id) {
      this.allDeals$ = this.dealService.fetchDealsByContactId(this.contact.id);
    } else {
      this.allDeals$ = of([]);
    }
  }

  private loadActivityTypes() {
    this.allActivityTypes$ = this.activityService.fetchAllActivityTypes();
  }

  private handleDealsResponse(deals: DealLightweight[]) {
    this.availableDeals = deals;
  }

  private handleActivityTypesResponse(activityTypes: ActivityType[]) {
    this.availableActivityTypes = activityTypes.filter(type => type.activityTypeCreator === 'USER');

    if (this.activity.type) {
      //we're editing instead of adding if we get here
      this.pageTitle = 'Edit Activity';

      this.selectedActivityType = this.availableActivityTypes.find(type => this.activity.type.id === type.id);
      if (this.selectedActivityType) this.availableActivityOutcomes = this.selectedActivityType.possibleOutcomes;
    } else if (this.route.snapshot.queryParams['type']) {
      this.addingActivityType = true;
    } 
  }

  private handleDataLoadError(err: Error) {
    console.error(err);
    this.alertService.error("Problem loading supporting data")
    this.loading = false;
  }

  private loadContacts() {
    this.contacts$ = this.contactService.fetchMyContacts();
  }

  private handleContactsResponse(contacts: Contact[]) {
    this.contacts = contacts;

    if (this.activity.contact) {
      //editing
      this.contact = this.contacts.find(contact => this.activity.contact.id === contact.id);
      this.updateDeals();
    }
  }

  private createForm() {
    this.activityFormGroup = this.fb.group({
      'type': [(this.activity.type) ? this.activity.type.name : '', [Validators.required]],
      'title': [this.activity.title, [Validators.required, Validators.pattern('^[a-zA-Z0-9,.\' \-\]*$')]],
      'location': [this.activity.location, [Validators.pattern('^[a-zA-Z0-9,.\' \-\]*$')]],
      'startDate': [null, [this.startDateValidator()]],
      'startHour': [12],
      'startMinute': [0],
      'startMeridian': ['AM'],
      'endDate': [null, [this.endDateValidator()]],
      'endHour': [12],
      'endMinute': [0],
      'endMeridian': ['AM'],
      'contact': [(this.activity.contact) ? this.activity.contact.id : '', [Validators.required]],
      'outcome': [(this.activity.outcome) ? this.activity.outcome.id : ''],
      'notes': [this.activity.notes],
      'deal': [(this.activity.deal) ? this.activity.deal.id : ''],
      'status': [(this.activity.type && this.activity.type.usesStatus) ? this.activity.status : null],
      'trackStatus': [(this.activity.type) ? this.activity.type.usesStatus : false]
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

      this.updateFormForStatus();
    }

    this.setCalendarInputs();
  }

  private updateFormForStatus() {
    if (this.selectedActivityType.usesStatus) {
      this.activityFormGroup.controls['status'].setValue('PENDING');
      this.activityFormGroup.controls['trackStatus'].setValue(true);
    } else {
      this.activityFormGroup.controls['status'].setValue(null);
      this.activityFormGroup.controls['trackStatus'].setValue(false);
    }
  }

  contactChanged(id: string) {
    if (this.contacts && id) {
      this.contact = this.contacts.find(contact => contact.id === id);
    }

    this.updateDeals();
  }

  private updateDeals() {
    this.dealService.fetchDealsByContactId(this.contact.id).subscribe(
      (deals: DealLightweight[]) => this.handleDealsResponse(deals),
      (err: Error) => this.handleDataLoadError(err)
    )
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
    this.saving = true;
    this.alertService.clear();

    //force all fields to validate one more time just to be sure
    Object.keys(this.activityFormGroup.controls).forEach(field => {
      let control = this.activityFormGroup.get(field);
      control.updateValueAndValidity();
    });

    if (this.formService.formHasErrors(this.activityFormGroup)) {
      this.alertService.error("Form contains errors. See below.");
      this.scrollToTop();
      this.saving = false;
    } else {
      this.setActivity();

      if (!this.activity.id) {
        this.activityService.createActivity(this.activity).subscribe(
          (activity: Activity) => this.handleActivitySaveResponse(activity),
          err => this.handleActivitySaveError(err)
        );
      } else {
        this.activityService.updateActivity(this.activity).subscribe(
          (activity: Activity) => this.handleActivitySaveResponse(activity),
          err => this.handleActivitySaveError(err)
        );
      }
    }
  }

  private handleActivitySaveResponse(activity: Activity) {
    this.alertService.success("Activity successfully saved!", { keepAfterRouteChange: true });
    this.activity = activity;
    let route = '/activities/view-activity';
    this.router.navigate([route], { queryParams: { id: activity.id } });
  }

  private handleActivitySaveError(err: Error) {
    this.alertService.error("There was a problem. Please call support.");
    this.scrollToTop();

    console.error(err);

    this.saving = false;
  }

  private getDealLightweight(): DealLightweight {
    let deal: DealLightweight = null;

    if (this.activityFormGroup.controls['deal'].value) {
      deal = this.availableDeals.find(d => d.id === this.activityFormGroup.controls['deal'].value); 
    }

    return deal;
  }

  private setActivity() {
    let outcome: ActivityOutcome = null;

    let user = this.userService.user;
    let salesOwner: SalesOwnerLightweight = { id: user.id, firstName: user.firstName, lastName: user.lastName, username: user.username }
    let account: AccountLightweight = { id: this.contact.account.id, name: this.contact.account.name };
    let contact: ContactLightweight = { id: this.contact.id, firstName: this.contact.firstName, lastName: this.contact.lastName, account: account, salesOwner: salesOwner };
    let activityType: ActivityTypeLightweight = { id: this.selectedActivityType.id, name: this.selectedActivityType.name, icon: this.selectedActivityType.icon, activityTypeCreator: this.selectedActivityType.activityTypeCreator, usesStatus: this.selectedActivityType.usesStatus };

    if (this.availableActivityOutcomes && this.isDateInPast()) {
      outcome = this.availableActivityOutcomes.find(outcome => outcome.id == this.activityFormGroup.controls['outcome'].value);
    }

    let deal: DealLightweight = this.getDealLightweight();

    this.activity.contact = contact;
    this.activity.location = this.activityFormGroup.controls['location'].value;

    //don't want 'undefined' in here
    this.activity.notes = this.activityFormGroup.controls['notes'].value;
    if (!this.activity.notes) this.activity.notes = '';

    this.activity.outcome = outcome;
    this.activity.startDate = this.dateService.convertToUtc(this.currentStartDate);
    this.activity.title = this.activityFormGroup.controls['title'].value;
    this.activity.type = activityType;
    this.activity.deal = deal;

    if (this.selectedActivityType.usesEndDate) this.activity.endDate = this.dateService.convertToUtc(this.currentEndDate);
    if (this.selectedActivityType.usesStatus) this.activity.status = this.activityFormGroup.controls['status'].value;
  }

  private scrollToTop() {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
  }

  trackStatusChange() {
    if (this.selectedActivityType) {
      let trackStatus: boolean = this.activityFormGroup.controls['trackStatus'].value;
      this.selectedActivityType.usesStatus = trackStatus;
      
      this.updateFormForStatus();
    }
  }
}
