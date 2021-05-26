import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { MultipleClassesBaseDirective } from '../../../directives/multiple-classes-base.directive';
import { Deal } from '../models/deal';

@Directive({
  selector: '[displayStage]'
})
export class DisplayStageDirective extends MultipleClassesBaseDirective implements OnInit {

  @Input('displayStage') deal: Deal;

  constructor() {
    super();
  }

  ngOnInit() {
    console.log(this.deal);
    this._elementClass.push('badge');
    this.addExtraClass();
  }

  private addExtraClass() {
    if (this.deal && this.deal.stage) {
      let extraClass: string = null;
      let stageName: string = this.deal.stage.name;

      if (stageName == 'Won') extraClass = 'badge-success';
      else if (stageName == 'Lost') extraClass = 'badge-error';
      else if (stageName != 'Won' && stageName != 'Lost') extraClass = 'badge-info';

      if (extraClass) this._elementClass.push(extraClass);
    }
  }
} 
