import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService, User } from 'carey-user';
import { AlertService } from 'carey-alert';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { ActivityType } from '../models/activity-type';
import { ActivityService } from '../service/activity.service';
import { ActivitySearchCriteria } from '../models/activity-search-criteria';
import { Activity } from '../models/activity';
import { DateService } from '../../../services/date.service';
import { DisplayValueMap } from '../../../models/name-value-map';
import { activityStatuses } from '../constants/activity-status';
import { ActivityOutcome } from '../models/activity-outcome';

const sortingDataAccessor = (item, property) => {
  switch (property) {
    case 'type': return item.type.name;
    case 'contact': return item.contact.lastName;
    case 'date': return item.startDate;
    default: return item[property];
  }
};

interface ContactLightweight {
  firstName: string;
  lastName: string;
  id: string;
}

@Component({
  selector: 'app-view-activities',
  templateUrl: './view-activities.component.html',
  styleUrls: ['./view-activities.component.css']
})
export class ViewActivitiesComponent implements OnInit {

  displayedColumns: string[] = ['action', 'title', 'contact', 'type', 'date', 'deal'];

  dataSource: MatTableDataSource<Activity>;
  currentUser: User;
  dataLoading: boolean = true;

  availableActivityTypes: ActivityType[] = [];
  availableStatuses: DisplayValueMap[] = activityStatuses;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  typeFilter = new FormControl('');
  contactFilter = new FormControl('');
  statusFilter = new FormControl('');
  outcomeFilter = new FormControl('');

  filterValues: any = {
    type: '',
    contact: '',
    status: '',
    outcome: ''
  }

  availableContacts: ContactLightweight[] = [];
  availableOutcomes: ActivityOutcome[] = [];

  constructor(private userService: UserService, private activityService: ActivityService,
    private alertService: AlertService, private displayValueMapService: DisplayValueMapService,
    private router: Router, private dateService: DateService) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.user;
    this.loadData();
  }

  private loadData() {
    this.loadActivityTypes();
  }

  private loadActivityTypes() {
    this.activityService.fetchAllActivityTypes().subscribe(
      (allActivityTypes: ActivityType[]) => this.handleActivityTypesResponse(allActivityTypes),
      (err) => this.handleActivityTypesError(err)
    );
  }

  private handleActivityTypesResponse(activityTypes: ActivityType[]) {
    this.availableActivityTypes = activityTypes;
    this.loadActivities();
  }

  private setFilterData() {
    let tempContacts: ContactLightweight[] = [];
    let tempOutcomes: ActivityOutcome[] = [];

    this.dataSource.data.forEach(activity => {
      if (activity.contact) {
        let contact = activity.contact;
        let isPresent: boolean = tempContacts.some(function (el) { return el.id === contact.id });

        if (!isPresent) {
          let contactLight: ContactLightweight = { firstName: contact.firstName, lastName: contact.lastName, id: contact.id };
          tempContacts.push(contactLight);
        }
      }

      if (activity.outcome) {
        let outcome = activity.outcome;
        let isPresent: boolean = tempOutcomes.some(function (el) { return el.id === outcome.id });

        if (!isPresent) {
          tempOutcomes.push(outcome);
        }
      }
    });

    this.availableContacts = tempContacts.sort((a, b) => a.lastName > b.lastName ? 1 : a.lastName === b.lastName ? 0 : -1);
    this.availableOutcomes = tempOutcomes.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1);
  }

  private handleActivityTypesError(err: Error) {
    console.error(err);
    this.alertService.error("Problem loading activity types!");
  }

  private fieldListener() {
    this.typeFilter.valueChanges
      .subscribe(
        type => {
          this.filterValues.type = type;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    )

    this.contactFilter.valueChanges
      .subscribe(
        contact => {
          this.filterValues.contact = contact;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    )

    this.statusFilter.valueChanges
      .subscribe(
        status => {
          this.filterValues.status = status;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    )

    this.outcomeFilter.valueChanges
      .subscribe(
        outcome => {
          this.filterValues.outcome = outcome;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    )
  }

  clearFilter() {
    this.typeFilter.setValue('');
    this.contactFilter.setValue('');
    this.statusFilter.setValue('');
    this.outcomeFilter.setValue('');
  }

  private createFilter(): (activity: Activity, filter: string) => boolean {
    let filterFunction = function (activity, filter): boolean {
    let searchTerms = JSON.parse(filter);

    let qualifies: boolean = true;

    if (searchTerms.type) {
      qualifies = (activity.type && activity.type.name && activity.type.name.indexOf(searchTerms.type) !== -1);
    }

    if (searchTerms.contact) {
      qualifies = qualifies && (activity.contact && activity.contact.id && activity.contact.id.indexOf(searchTerms.contact) !== -1);
    }

    if (searchTerms.status) {
      qualifies = qualifies && (activity.status && activity.status.indexOf(searchTerms.status) !== -1);
    }

    if (searchTerms.outcome) {
      qualifies = qualifies && (activity.outcome && activity.outcome.name && activity.outcome.name.indexOf(searchTerms.outcome) !== -1);
    }

    return qualifies;
  }

    return filterFunction;
  }


  private loadActivities() {
    if (this.currentUser) {
      let searchCriteria: ActivitySearchCriteria = new ActivitySearchCriteria();
      searchCriteria.salesOwnerId = this.currentUser.id;

      this.activityService.fetchActivitiesByCriteria(searchCriteria)
        .subscribe(
          (activities: Activity[]) => this.handleActivities(activities),
          err => this.handleActivitiesError(err)
        );
    } else {
      this.alertService.error("Problem identifying user!");
      this.dataLoading = false;
    }
  }

  private handleActivities(activities: Activity[]) {
    this.dataLoading = false;
    this.dataSource = new MatTableDataSource(activities);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = sortingDataAccessor;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();

    this.fieldListener();
    this.setFilterData();
  }

  private handleActivitiesError(err) {
    console.error(err);
    this.alertService.error("Problem loading activities!");
  }

  editActivity(activity: Activity) {
    let route = '/activities/edit-activity';
    this.router.navigate([route], { queryParams: { activityId: activity.id } });
  }

  viewActivity(activity: Activity) {
    let route = '/activities/view-activity';
    this.router.navigate([route], { queryParams: { id: activity.id } });
  }

}
