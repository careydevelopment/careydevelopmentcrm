import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

export const routes = [
    { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
    declarations: [
        DashboardComponent
    ],
  imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ]
})
export class DashboardModule {
    constructor() {
        console.log("In module");
    }
}
