import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

const pipe = new DatePipe('en-US');

@Injectable({ providedIn: 'root' })
export class CurrencyService {

  constructor() { }

  formatForDollars(cents: number): number {
    let dollars: number = 0;

    if (cents) {
      dollars = cents / 100;
    }

    return dollars;
  }
}
