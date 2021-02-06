import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../ui/alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Activity } from '../models/activity';
import { ActivityService } from '../service/activity.service';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.css']
})
export class EditActivityComponent implements OnInit {

  loading: boolean = true;
  activity: Activity;

  constructor(private route: ActivatedRoute, 
    private alertService: AlertService, private router: Router,
    private activityService: ActivityService) { }

  ngOnInit(): void {
    this.loadActivity();
  }

  private loadActivity() {
    let activity$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.activityService.fetchActivityById(params.get('activityId')))
    );

    activity$.subscribe(
      (activity: Activity) => this.handleActivityResponse(activity),
      err => this.handleActivityError(err)
    );
  }

  private handleActivityResponse(activity: Activity) {
    this.activity = activity;
    this.loading = false;
  }

  private handleActivityError(err: Error) {
    this.loading = false;
    console.error(err);

    let alertMessage: string = 'Something went wrong, please call support';

    if (err instanceof HttpErrorResponse) {
      if (err.status) {
        if (err.status == 404) {
          alertMessage = 'Activity with that ID does not exist';
        }
      }
    }

    this.alertService.error(alertMessage);
  }
}
