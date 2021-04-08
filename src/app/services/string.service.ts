import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class StringService {

  removeInvisibleCharacters(str: string): string {
    let result: string = str.replace(/[\p{Cf}]/gu, '');
    result = result.trim();

    return result;
  }
}
