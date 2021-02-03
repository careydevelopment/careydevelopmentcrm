import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contact } from '../../contacts/models/contact';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../ui/alert/alert.service';
import { ContactService } from '../../service/contact.service';
import { DropdownService } from '../../ui/service/dropdown.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationErrors, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Activity } from '../models/activity';
import { ActivityType } from '../models/activity-type';
import { ActivityService } from '../service/activity.service';

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

  activityFormGroup: FormGroup;

  availableActivityTypes: ActivityType[] = [this.loadingActivityType];


  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private router: Router,
    private dropDownService: DropdownService, private fb: FormBuilder, private activityService: ActivityService) { }

  ngOnInit(): void {
    this.loadData();
    this.createForm();
  }

  private loadData() {
    if (this.route.snapshot.queryParams['contactId']) {
      this.loadContact();
    } else {
      this.loading = false;
    }

    this.loadActivityTypes();
  }

  private loadActivityTypes() {
    this.activityService.fetchAllActivityTypes().subscribe(
      (activityTypes: ActivityType[]) => this.handleActivityTypesResponse(activityTypes),
      err => this.handleActivityTypesError(err)
    );
  }

  private handleActivityTypesResponse(activityTypes: ActivityType[]) {
    this.availableActivityTypes = activityTypes;
  }

  private handleActivityTypesError(err: Error) {
    console.error(err);
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
    console.log(err);
    this.loading = false;

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
    //if (!this.contact) this.contact = { 'status': 'NEW', 'authority': false } as Contact;

    this.activityFormGroup = this.fb.group({
      'type': [this.activity.type, [Validators.required]],
      'title': [this.activity.title, [Validators.pattern('^[a-zA-Z \-\]*$')]],
      'location': [this.activity.location, [Validators.pattern('^[a-zA-Z \-\]*$')]]
    });
  }

  activityTypeChanged(name: string) {
    if (this.availableActivityTypes && name) {
      this.selectedActivityType = this.availableActivityTypes.find(type => type.name === name);
    }
  }
}
