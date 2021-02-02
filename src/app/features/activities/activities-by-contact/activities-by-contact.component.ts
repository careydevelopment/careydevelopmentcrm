import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivityService } from '../service/activity.service';
import { Activity } from '../models/activity';

@Component({
  selector: 'app-activities-by-contact',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './activities-by-contact.component.html',
  styleUrls: ['./activities-by-contact.component.css']
})
export class ActivitiesByContactComponent implements OnInit {

  @Input() contactId: string;

  constructor(private activityService: ActivityService) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  private loadActivities() {
    this.activityService.fetchActivitiesByContactId(this.contactId).subscribe(
      (activities: Activity[]) => this.handleFetchActivitiesResponse(activities),
      err => this.handleFetchActivitiesError(err)
    );
  }

  private handleFetchActivitiesResponse(activities: Activity[]) {
    console.log("Activities is ", activities);
  }

  private handleFetchActivitiesError(err: Error) {
    console.error(err);
  }

}
