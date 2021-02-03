import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecentActivitiesByContactComponent } from './recent-activities-by-contact/recent-activities-by-contact.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { ViewActivityComponent } from './view-activity/view-activity.component';
import { ViewActivitiesComponent } from './view-activities/view-activities.component';
import { AlertModule } from '../../ui/alert/alert.module';

export const routes = [];

@NgModule({
  declarations: [
    RecentActivitiesByContactComponent,
    ActivityFormComponent,
    AddActivityComponent,
    ViewActivityComponent,
    ViewActivitiesComponent
  ],
  exports: [
    RecentActivitiesByContactComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AlertModule,
    RouterModule.forChild(routes)
  ]
})
export class ActivitiesModule { }
