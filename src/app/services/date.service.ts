import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

const pipe = new DatePipe('en-US');

@Injectable({ providedIn: 'root' })
export class DateService {

    constructor() { }

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

        let dateString = "";

        dateString += today.getFullYear();
        dateString += '-';
        dateString += this.pad(today.getMonth() + 1);
        dateString += '-';
        dateString += this.pad(today.getDate());
        dateString += 'T';
        dateString += '00:00:00';

        let midnightDate = new Date(dateString);

        return midnightDate.getTime();
    }

    private pad(valNumber: number) {
        let val: string = '' + valNumber;

        if (val.length < 2) {
            val = '0' + val;
        }

        return val;
    }
}
