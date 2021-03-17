import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DealsModule } from '../deals/deals.module';
import { FlexLayoutModule } from '@angular/flex-layout';

export const routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full',
    data: {
      breadcrumb: 'Dashboard'
    }
  }
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DealsModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule {
    constructor() { }
}
