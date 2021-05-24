import { Pipe, PipeTransform } from '@angular/core';

const MILLISECONDS_IN_SECOND: number = 1000;
const MILLISECONDS_IN_MINUTE: number = 60 * MILLISECONDS_IN_SECOND;
const MILLISECONDS_IN_HOUR: number = MILLISECONDS_IN_MINUTE * 60;
const MILLISECONDS_IN_DAY: number = MILLISECONDS_IN_HOUR * 24;
const SINGLE_DAY: string = 'day';
const PLURAL_DAY: string = 'days'
const SINGLE_HOUR: string = 'hour';
const PLURAL_HOUR: string = 'hours';
const SINGLE_MINUTE: string = 'minute';
const PLURAL_MINUTE: string = 'minutes';

/**
 * This pipe spits out the difference between two dates in readable format.
 *
 * It accepts a number that represents the difference between two dates. In milliseconds.
 *
 * If that number is negative, then the event happened in the past.
 *
 * The pipe translates the difference to something like "43 minutes ago" or "3 days ago."
 * */
@Pipe({
  name: 'timeDifference'
})
export class TimeDifferencePipe implements PipeTransform {
  transform(value: number): string {
    let display: string = "calculating...";
    let tense: string = 'from now';

    if (value) {
      if (value < 0) {
        tense = 'ago';
        value = Math.abs(value);
      }

      if (value < MILLISECONDS_IN_MINUTE) {
        display = `less than a minute ${tense}`;
      } else if (value < MILLISECONDS_IN_HOUR) {
        let minutes: number = Math.floor(value / MILLISECONDS_IN_MINUTE);
        let units: string = (minutes == 1) ? SINGLE_MINUTE : PLURAL_MINUTE;
        display = `${minutes} ${units} ${tense}`;
      } else if (value < MILLISECONDS_IN_DAY) {
        let hours: number = Math.floor(value / MILLISECONDS_IN_HOUR);
        let minutes: number = (Math.floor((value - (hours * MILLISECONDS_IN_HOUR)) / MILLISECONDS_IN_MINUTE));
        let hoursUnits: string = (hours == 1) ? SINGLE_HOUR : PLURAL_HOUR;
        let minutesUnits: string = (minutes == 1) ? SINGLE_MINUTE : PLURAL_MINUTE;
        display = `${hours} ${hoursUnits}, ${minutes} ${minutesUnits} ${tense}`;
      } else {
        let days: number = Math.floor(value / MILLISECONDS_IN_DAY);
        let daysUnits: string = (days == 1) ? SINGLE_DAY : PLURAL_DAY;
        display = `${days} ${daysUnits} ${tense}`;
      }
    }

    return display;
  }
}
