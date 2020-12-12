import { Injectable } from '@angular/core';
import { DropdownOption } from '../model/dropdown-option';

@Injectable({ providedIn: 'root' })
export class DropdownService {

  constructor() { }

  getDisplay(value: string, list: DropdownOption[]): string {
    let display = '';

    for (let i = 0; i < list.length; i++) {
      if (list[i].value == value) {
        display = list[i].display;
        break;
      }
    }

    return display;
  }
}
