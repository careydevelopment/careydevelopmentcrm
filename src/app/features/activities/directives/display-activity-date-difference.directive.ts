import { Directive, Input, OnInit } from '@angular/core';
import { SingleClassBaseDirective } from '../../../directives/single-class-base.directive';
import { DateService } from '../../../services/date.service';
import { Activity } from '../models/activity';
import { ActivityService } from '../service/activity.service';

@Directive({
  selector: '[displayActivityDateDifference]'
})
export class DisplayActivityDateDifferenceDirective extends SingleClassBaseDirective implements OnInit {

  @Input('displayActivityDateDifference') currentDateDifference: number;
  @Input('activity') activity: Activity;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.currentDateDifference) {
      this.setClass();
    }
  }

  private setClass() {
    let className: string = '';

    if (this.currentDateDifference > 0 && this.currentDateDifference < 36000) className = 'info-text';

    if (this.activity.type) {
      if (this.currentDateDifference < 0 && this.activity.type.usesStatus) className = 'error-text';
      if (this.currentDateDifference < 0 && !this.activity.type.usesStatus) className = 'warning-text';
    }

    this._elementClass = className;
  }
} 
