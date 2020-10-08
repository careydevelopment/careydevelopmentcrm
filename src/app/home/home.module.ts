import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';

export const routes = [
    { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
      CommonModule,
      MatSliderModule,
      RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
