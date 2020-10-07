import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';


export const routes = [
    { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
      CommonModule,
      RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
