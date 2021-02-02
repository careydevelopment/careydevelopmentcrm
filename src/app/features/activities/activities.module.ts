import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { ActivitiesByContactComponent } from './activities-by-contact/activities-by-contact.component';
import { MatCardModule } from '@angular/material/card';

export const routes = [];

@NgModule({
  declarations: [ActivitiesByContactComponent],
  exports: [
    ActivitiesByContactComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    RouterModule.forChild(routes)
  ]
})
export class ActivitiesModule { }
