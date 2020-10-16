import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from './features.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

export const routes = [
    { path: '', component: FeaturesComponent }
];

@NgModule({
  declarations: [FeaturesComponent],
  imports: [
      CommonModule,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatIconModule,
      RouterModule.forChild(routes)
  ]
})
export class FeaturesModule { }
