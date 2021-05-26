import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Activity } from '../models/activity';
import { DateService } from '../../../services/date.service';
import { ActivityType } from '../models/activity-type';
import { ActivitySearchCriteria } from '../models/activity-search-criteria';

const baseUrl: string = environment.baseCrmServiceUrl;
const recentActivitiesDays = 60;

@Injectable({ providedIn: 'root' })
export class ActivityService {

  constructor(private http: HttpClient, private dateService: DateService) { }

  fetchActivitiesByCriteria(criteria: ActivitySearchCriteria): Observable<Activity[]> {
    let minDate: number = criteria.minDate;
    let maxDate: number = criteria.maxDate;
    let orderBy: string = criteria.orderBy;
    let orderType: string = criteria.orderType;
    let contactId: string = criteria.contactId;
    let dealId: string = criteria.dealId;
    let salesOwnerId: string = criteria.salesOwnerId;

    let url = `${baseUrl}/activities/search?dealId=${dealId}&contactId=${contactId}&minDate=${minDate}&
              maxDate=${maxDate}&orderBy=${orderBy}&orderType=${orderType}&salesOwnerId=${salesOwnerId}`;

    console.log("Fetch activities by deal URL is " + url);

    return this.http.get<Activity[]>(url);
  }

  fetchActivitiesByDealId(dealId: string): Observable<Activity[]> {
    let minDate = this.dateService.getDaysBackwardAsNumber(recentActivitiesDays);
    let orderBy = 'startDate';
    let orderType = 'DESC';

    let url = `${baseUrl}/activities/search?dealId=${dealId}&minDate=${minDate}&orderBy=${orderBy}&orderType=${orderType}`;
    console.log("Fetch activities by deal URL is " + url);

    return this.http.get<Activity[]>(url);
  }

  fetchRecentActivitiesByContactId(contactId: string): Observable<Activity[]> {
    let minDate = this.dateService.getDaysBackwardAsNumber(recentActivitiesDays);
    let orderBy = 'startDate';
    let orderType = 'DESC';
    let status = 'COMPLETED';

    let url = `${baseUrl}/activities/search?contactId=${contactId}&minDate=${minDate}&orderBy=${orderBy}&orderType=${orderType}&status=${status}`;
    console.log("Fetch activities by contact URL is " + url);

    return this.http.get<Activity[]>(url);
  }

  fetchAllActivityTypes(): Observable<ActivityType[]> {
    let url = `${baseUrl}/activitytypes`;
    return this.http.get<ActivityType[]>(url);
  }

  createActivity(activity: Activity): Observable<Activity> {
    let url = `${baseUrl}/activities`;
    return this.http.post<Activity>(url, activity);
  }

  updateActivity(activity: Activity): Observable<Activity> {
    let url = `${baseUrl}/activities/${activity.id}`;
    return this.http.put<Activity>(url, activity);
  }

  fetchActivityById(activityId: string): Observable<Activity> {
    let url = `${baseUrl}/activities/${activityId}`;
    return this.http.get<Activity>(url);
  }

  isOverdue(activity: Activity): boolean {
    let overdue: boolean = false;

    if (activity && activity.type && activity.type.usesStatus) {
      if (activity.status == 'PENDING') {
        if (activity.startDate) {
          let localDueDate: number = this.dateService.convertToLocal(activity.startDate);
          let now: number = Date.now();

          overdue = (now > localDueDate);
        }
      }
    }

    return overdue;
  }
 }
