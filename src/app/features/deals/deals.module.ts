import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AlertModule } from 'carey-alert';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DealsByContactComponent } from './deals-by-contact/deals-by-contact.component';
import { DealFormComponent } from './deal-form/deal-form.component';
import { EditDealComponent } from './edit-deal/edit-deal.component';
import { AddDealComponent } from './add-deal/add-deal.component';
import { ViewDealComponent } from './view-deal/view-deal.component';
import { StageProgressBarComponent } from './stage-progress-bar/stage-progress-bar.component';
import { FuturePipelineComponent } from './charts/future-pipeline/future-pipeline.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DealShareByContactComponent } from './charts/deal-share-by-contact/deal-share-by-contact.component';
import { RevenueContributionComponent } from './charts/revenue-contribution/revenue-contribution.component';
import { AccountsRankedComponent } from './charts/accounts-ranked/accounts-ranked.component';
import { ActivitiesModule } from '../activities/activities.module';
import { DisplayStageDirective } from './directives/display-stage.directive';
import { ViewDealsComponent } from './view-deals/view-deals.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';

 
export const routes = [
  {
    path: 'add-deal',
    component: AddDealComponent,
    data: {
      breadcrumb: 'Add Deal'
    }
  },
  {
    path: 'edit-deal',
    component: EditDealComponent,
    data: {
      breadcrumb: 'Edit Deal',
      pauseDisplay: true
    }
  },
  {
    path: 'view-deal',
    component: ViewDealComponent,
    data: {
      breadcrumb: 'View Deal',
      pauseDisplay: true
    }
  },
  {
    path: 'view-deals',
    component: ViewDealsComponent,
    data: {
      breadcrumb: 'View Deals'
    }
  }
];


@NgModule({
  declarations: [
    DisplayStageDirective,
    DealsByContactComponent,
    DealFormComponent,
    EditDealComponent,
    AddDealComponent,
    ViewDealComponent,
    StageProgressBarComponent,
    FuturePipelineComponent,
    DealShareByContactComponent,
    RevenueContributionComponent,
    AccountsRankedComponent,
    ViewDealsComponent
  ],
  exports: [
    DealsByContactComponent,
    FuturePipelineComponent,
    DealShareByContactComponent,
    RevenueContributionComponent,
    AccountsRankedComponent
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
    ActivitiesModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    RouterModule.forChild(routes)
  ]
})
export class DealsModule { }
