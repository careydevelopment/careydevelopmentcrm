import { HostBinding, Input } from "@angular/core";

export abstract class MultipleClassesBaseDirective {

  protected _elementClass: string[] = [];

  @Input('class')
  @HostBinding('class')
  get elementClass(): string {
    return this._elementClass.join(' ');
  }

  set(val: string) {
    this._elementClass = val.split(' ');
  }
} 
