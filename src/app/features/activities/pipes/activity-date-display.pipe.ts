import { Pipe, PipeTransform } from '@angular/core';
import { DateService } from '../../../services/date.service';
import { Activity } from '../models/activity';

@Pipe({
  name: 'activityDateDisplay'
})
export class ActivityDateDisplayPipe implements PipeTransform {

  constructor(private dateService: DateService) { }

  transform(activity: Activity): string {
    let display: string = '';

    if (activity) {
      if (activity.startDate) {
        let startDate: number = this.dateService.convertToLocal(activity.startDate);

        display = this.dateService.getShortDateAndTimeDisplay(startDate);

        if (activity.endDate) {
          let endDate = this.dateService.convertToLocal(activity.endDate);

          let startTimeDisplay: string = this.dateService.getShortTimeDisplay(startDate);
          let endTimeDisplay: string = this.dateService.getShortTimeDisplay(endDate);

          let startDateDisplay: string = this.dateService.getShortDateDisplay(startDate);
          let endDateDisplay: string = this.dateService.getShortDateDisplay(endDate);

          if (startDateDisplay == endDateDisplay) {
            display = startDateDisplay + " " + startTimeDisplay + " - " + endTimeDisplay;
          } else {
            display = display + " - " + this.dateService.getShortDateAndTimeDisplay(endDate);
          }
        }
      }
    }

    return display;
  }
}
