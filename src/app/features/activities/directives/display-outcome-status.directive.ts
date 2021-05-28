import { Directive, Input, OnInit } from '@angular/core';
import { MultipleClassesBaseDirective } from '../../../directives/multiple-classes-base.directive';
import { Activity } from '../models/activity';
import { ActivityOutcome } from '../models/activity-outcome';
import { ActivityService } from '../service/activity.service';

@Directive({
  selector: '[displayOutcomeStatus]'
})
export class DisplayOutcomeStatusDirective extends MultipleClassesBaseDirective implements OnInit {

  @Input('displayOutcomeStatus') activity: Activity;

  constructor(private activityService: ActivityService) {
    super();
  }

  ngOnInit() {
    this._elementClass.push('badge');
    this.addExtraClass();
  }

  private addExtraClass() {
    if (this.activity) {
      let extraClass: string = null;
      let outcome: ActivityOutcome = this.activity.outcome;
      let status: string = this.activity.status;

      if (outcome && outcome.sentiment) {
        let sentiment = outcome.sentiment;

        if (sentiment == 'POSITIVE') extraClass = 'badge-success';
        else if (sentiment == 'NEGATIVE') extraClass = 'badge-error';
        else extraClass = 'badge-info';
      } else {
        if (status == 'COMPLETED') extraClass = 'badge-success';
        else if (this.activityService.isOverdue(this.activity)) extraClass = 'badge-error';
        else if (status == 'ON_HOLD') extraClass = 'badge-warning';
      }

      if (extraClass) this._elementClass.push(extraClass);
    }
  }
} 
