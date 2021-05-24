import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertService } from 'carey-alert';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { ActivityType } from '../models/activity-type';
import { ActivityOutcome } from '../models/activity-outcome';
import { DealLightweight } from '../../deals/models/deal-lightweight';
import { Activity } from '../models/activity';
import { ActivityService } from '../service/activity.service';


@Component({
  selector: 'app-view-activity',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.css']
})
export class ViewActivityComponent implements OnInit {

  availableActivityTypes: ActivityType[] = [];
  availableActivityOutcomes: ActivityOutcome[] = [];
  availableDeals: DealLightweight[] = [];

  loading: boolean = true;
  activity: Activity  = {} as Activity;

  constructor(private route: ActivatedRoute, private activityService: ActivityService,
    private alertService: AlertService, private router: Router, private displayValueMapService: DisplayValueMapService,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    let activity$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.activityService.fetchActivityById(params.get('id')))
    );

    activity$.subscribe(
      (activity: Activity) => this.handleResponse(activity),
      err => this.handleError(err)
    );
  }

  private handleResponse(activity: Activity) {
    this.activity = activity;
    this.loading = false;

    if (this.activity) {
      this.breadcrumbService.updateBreadcrumb("View " + this.activity.title);
    }
  }

  private handleError(err: Error) {
    console.log(err);
    this.loading = false;

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

  editActivity() {
    let route = '/activities/edit-activity';
    this.router.navigate([route], { queryParams: { activityId: this.activity.id } });
  }
}
