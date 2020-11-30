import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteMessageComponent } from './route-message.component';
import { AlertModule } from '../alert/alert.module';

@NgModule({
  declarations: [RouteMessageComponent],
  imports: [
    CommonModule,
    AlertModule
  ],
  exports: [RouteMessageComponent]
})
export class RouteMessageModule { }
