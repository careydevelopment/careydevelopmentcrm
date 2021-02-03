import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { RecentActivitiesByContactComponent } from './recent-activities-by-contact/recent-activities-by-contact.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


export const routes = [];

@NgModule({
  declarations: [RecentActivitiesByContactComponent],
  exports: [
    RecentActivitiesByContactComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ]
})
export class ActivitiesModule { }
