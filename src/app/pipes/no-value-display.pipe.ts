import { P } from '@angular/cdk/keycodes';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe displays a "no value entered" message when there's no value for a particular
 * form field.
 * */
@Pipe({
  name: 'noValueDisplay'
})
export class NoValueDisplayPipe implements PipeTransform {
  transform(value: string): string {

    if (!value) {
      return "(No value entered)";
    } else return value;
  }
}
