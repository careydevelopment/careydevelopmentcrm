import { NgModule, LOCALE_ID } from '@angular/core';
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
import { AlertModule } from 'carey-alert';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditActivityComponent } from './edit-activity/edit-activity.component';
import { ActivitiesListComponent } from './activities-list/activities-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { ActivityDateDisplayPipe } from './pipes/activity-date-display.pipe';
import { TimeDifferencePipe } from '../../pipes/time-difference.pipe';
import { ViewActivityMenuComponent } from './view-activity/view-activity-menu/view-activity-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateNotesDialog } from './ui/update-notes-dialog/update-notes-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DisplayOutcomeStatusDirective } from './directives/display-outcome-status.directive';
import { DisplayActivityDateDifferenceDirective } from './directives/display-activity-date-difference.directive';


export const routes = [
  {
    path: 'add-activity',
    component: AddActivityComponent,
    data: {
      breadcrumb: 'Add Activity'
    }
  },
  {
    path: 'edit-activity',
    component: EditActivityComponent,
    data: {
      breadcrumb: 'Edit Activity',
      pauseDisplay: true
    }
  },
  {
    path: 'view-activity',
    component: ViewActivityComponent,
    data: {
      breadcrumb: 'View Activity'
    }
  },
  {
    path: 'view-activities',
    component: ViewActivitiesComponent,
    data: {
      breadcrumb: 'View Activities'
    }
  }
];

@NgModule({
  declarations: [
    ActivityDateDisplayPipe,
    TimeDifferencePipe,
    DisplayOutcomeStatusDirective,
    DisplayActivityDateDifferenceDirective,
    RecentActivitiesByContactComponent,
    ActivityFormComponent,
    AddActivityComponent,
    ViewActivityComponent,
    ViewActivitiesComponent,
    EditActivityComponent,
    ActivitiesListComponent,
    ViewActivityMenuComponent,
    UpdateNotesDialog
  ],
  exports: [
    RecentActivitiesByContactComponent,
    ActivitiesListComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AlertModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    RouterModule.forChild(routes)
  ]
})
export class ActivitiesModule { }
