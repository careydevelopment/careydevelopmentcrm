import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const pipe = new DatePipe('en-US');

@Injectable({ providedIn: 'root' })
export class DateService {

  private $_counterBySecond: Observable<number>;

  constructor() { }

  get counterBySecond(): Observable<number> {
    if (!this.$_counterBySecond) {
      this.$_counterBySecond = interval(1000).pipe(
        map((x) => {
          return Date.now();
        })
      );
    }

    return this.$_counterBySecond;
  }

  convertToUtc(localTime: number): number {
    let date = new Date(localTime);
    let offset = date.getTimezoneOffset();

    let newDate = localTime + (offset * 60 * 1000);

    console.log(pipe.transform(newDate, 'full'));

    return newDate;
  }


  convertToLocal(utcTime: number): number {
    let date = new Date(utcTime);
    let offset = date.getTimezoneOffset();

    let newDate = utcTime - (offset * 60 * 1000);

    return newDate;
  }

  roundToNearest15Minutes(minutes: number): number {
    let min: number = 45;

    if (minutes <= 7 || minutes > 52) min = 0;
    else if (minutes <= 22) min = 15;
    else if (minutes <= 37) min = 30;

    return min;
  }

  getCustomDateDisplay(dateValue: number, format: string): string {
    let myFormattedDate = pipe.transform(dateValue, format);
    return myFormattedDate;
  }

  getShortDateDisplay(dateValue: number): string {
    let myFormattedDate = pipe.transform(dateValue, 'shortDate');
    return myFormattedDate;
  }

  getMediumDateDisplay(dateValue: number): string {
    let myFormattedDate = pipe.transform(dateValue, 'mediumDate');
    return myFormattedDate;
  }

  getShortDateAndTimeDisplay(dateValue: number): string {
    let myFormattedDate = pipe.transform(dateValue, 'short');
    return myFormattedDate;
  }

  getShortTimeDisplay(dateValue: number): string {
    let myFormattedDate = pipe.transform(dateValue, 'shortTime');
    return myFormattedDate;
  }

  isInThePast(dateValue: number): boolean {
    let inPast: boolean = false;
    let today: number = Date.now();

    if (dateValue < today) {
      inPast = true;
    }

    return inPast;
  }

  isToday(dateValue: number): boolean {
    let today = Date.now();
    let todayDate = this.getShortDateDisplay(today);
    let otherDate = this.getShortDateDisplay(dateValue);

    let isToday = (todayDate === otherDate);
    return isToday;
  }

  getDaysForwardAsNumber(daysForward: number): number {
    let dateValue = -1;

    let date: Date = new Date();
    date.setDate(date.getDate() + daysForward);
    date.setHours(8);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    dateValue = date.getTime();

    return dateValue;
  }

  getDaysBackwardAsNumber(daysBackward: number): number {
    let dateValue = -1;

    let date: Date = new Date();
    date.setDate(date.getDate() - daysBackward);
    date.setHours(8);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    dateValue = date.getTime();

    return dateValue;
  }

  getDaysForwardAtMidnightAsNumber(daysForward: number): number {
    let dateValue = -1;

    let date: Date = new Date();
    date.setDate(date.getDate() + daysForward);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    dateValue = date.getTime();

    return dateValue;
  }

  getMonthsForwardAsNumber(monthsForward: number): number {
    let dateValue = -1;

    let date: Date = new Date();
    date.setMonth(date.getMonth() + monthsForward);
    date.setHours(8);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    console.log(date);

    dateValue = date.getTime();

    return dateValue;
  }

  getTodayAtMidnightAsNumber(): number {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    return today.getTime();
  }

  translateDatePickerValueToNumber(dateString: string): number {
    let newDate: Date = new Date(dateString);
    return newDate.getTime();
  }

  translateDatePickerValueToNumberAtMidnight(dateString: string): number {
    let newDate: Date = new Date(dateString);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return newDate.getTime();
  }

  getDateVal(date: string, hour?: number, minute?: number, meridian?: string): number {
    let dateVal: number = -1;

    if (date) {
      dateVal = this.translateDatePickerValueToNumberAtMidnight(date);

      if (hour) {
        if (meridian && meridian == 'PM' && hour < 12) hour += 12;
        else if (meridian && meridian == 'AM' && hour == 12) hour = 0;

        let hourValue = hour * 60 * 60 * 1000;
        dateVal += hourValue;
      }

      if (minute) {
        let minuteValue = minute * 60 * 1000;
        dateVal += minuteValue;
      }
    }

    return dateVal;
  }

  getAvailableMonths(): string[] {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'];
  }

  getNumberOfDaysInMonth(month: string): number {
    const monthsWith30Days: string[] = ['March', 'May', 'July', 'September', 'November'];
    const monthsWith29Days: string[] = ['February'];

    let days: number = 31;

    if (monthsWith30Days.indexOf(month) > -1) days = 30
    else if (monthsWith29Days.indexOf(month) > -1) days = 29;

    return days;
  }
}
