import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Activity } from '../models/activity';

const baseUrl: string = environment.baseCrmServiceUrl;

@Injectable({ providedIn: 'root' })
export class ActivityService {

  constructor(private http: HttpClient) { }

  fetchActivitiesByContactId(contactId: string): Observable<Activity[]> {
    let url = `${baseUrl}/activities/search?contactId=${contactId}`;
    console.log("Fetch activities by contact URL is " + url);

    return this.http.get<Activity[]>(url);
  }
}
