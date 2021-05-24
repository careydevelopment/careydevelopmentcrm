import { NgModule } from '@angular/core';
import { PhoneMaskDirective } from '../util/phone-mask.directive';

@NgModule({
  declarations: [
    PhoneMaskDirective
  ],
  exports: [
    PhoneMaskDirective
  ]
})
export class DirectivesModule { }
