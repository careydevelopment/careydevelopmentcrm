import { Injectable } from '@angular/core';
import { DisplayValueMap } from '../../../models/name-value-map';

@Injectable({ providedIn: 'root' })
export class DisplayValueMapService {

  constructor() { }

  getDisplay(value: string, list: DisplayValueMap[]): string {
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
