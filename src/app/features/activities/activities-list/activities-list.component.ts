import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from '../../../services/date.service';
import { Activity } from '../models/activity';
import { ActivitySearchCriteria } from '../models/activity-search-criteria';
import { ActivityService } from '../service/activity.service';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css']
})
export class ActivitiesListComponent implements OnInit {

  @Input() activitySearchCriteria: ActivitySearchCriteria;
  @Input() title: string;

  activities: Activity[]
  loading: boolean = true;
  errorLoading: boolean = false;


  constructor(private activityService: ActivityService, private router: Router,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  private loadActivities() {
    this.activityService.fetchActivitiesByCriteria(this.activitySearchCriteria).subscribe(
      (activities: Activity[]) => this.handleFetchActivitiesResponse(activities),
      err => this.handleFetchActivitiesError(err)
    );
  }

  private handleFetchActivitiesResponse(activities: Activity[]) {
    this.activities = activities;
    this.loading = false;
  }

  private handleFetchActivitiesError(err: Error) {
    console.error(err);
    this.loading = false;
    this.errorLoading = true;
  }

  editActivity(activityId: string) {
    let route = '/activities/edit-activity';
    this.router.navigate([route], { queryParams: { activityId: activityId } });
  }
}
