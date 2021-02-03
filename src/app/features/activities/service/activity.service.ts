import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Activity } from '../models/activity';
import { DateService } from '../../../services/date.service';

const baseUrl: string = environment.baseCrmServiceUrl;
const recentActivitiesDays = 30;

@Injectable({ providedIn: 'root' })
export class ActivityService {

  constructor(private http: HttpClient, private dateService: DateService) { }

  fetchRecentActivitiesByContactId(contactId: string): Observable<Activity[]> {
    let minDate = this.dateService.getDaysBackwardAsNumber(recentActivitiesDays);
    let orderBy = 'startDate';
    let orderType = 'DESC';

    let url = `${baseUrl}/activities/search?contactId=${contactId}&minDate=${minDate}&orderBy=${orderBy}&orderType=${orderType}`;
    console.log("Fetch activities by contact URL is " + url);

    return this.http.get<Activity[]>(url);
  }
}
