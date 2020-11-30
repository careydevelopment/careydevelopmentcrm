import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RouteMessageService {
  private _message: string = null;

  get message(): string {
    const returnedMessage = this._message;
    this.clear();

    return returnedMessage;
  }

  set message(val: string) {
    this._message = val;
  }

  clear() {
    this.message = null;
  }
}
