import { HostBinding, Input } from "@angular/core";

export abstract class SingleClassBaseDirective {

  protected _elementClass: string = "";

  @Input('class')
  @HostBinding('class')
  get elementClass(): string {
    return this._elementClass;
  }

  set(val: string) {
    this._elementClass = val;
  }
} 
