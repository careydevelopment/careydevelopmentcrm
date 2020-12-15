import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AsYouType } from 'libphonenumber-js'

@Directive({
  selector: '[appPhoneMask]',
})
export class PhoneMaskDirective {

  @Input('countryCode') countryCode: string;

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {
    let asYouType: AsYouType = this.getFormatter();

    if (asYouType) {
      let newVal = event.replace(/\D/g, '');

      if (backspace && newVal.length <= 6) {
        newVal = newVal.substring(0, newVal.length - 1);
      }

      newVal = asYouType.input(newVal);

      this.ngControl.valueAccessor.writeValue(newVal);
    }
  }

  private getFormatter(): AsYouType {
    let asYouType: AsYouType = null;

    switch (this.countryCode) {
      case 'us':
        asYouType = new AsYouType('US');
        break;
      case 'jp':
        asYouType = new AsYouType('JP');
        break;
      case 'ca':
        asYouType = new AsYouType('CA');
        break;
      case 'ph':
        asYouType = new AsYouType('PH');
        break;
      case 'mx':
        asYouType = new AsYouType('MX');
        break;
      case 'be':
        asYouType = new AsYouType('BE');
        break;
      case 'lu':
        asYouType = new AsYouType('LU');
        break;
      case 'de':
        asYouType = new AsYouType('DE');
        break;
      case 'br':
        asYouType = new AsYouType('BR');
        break;
    }

    return asYouType;
  }
}
