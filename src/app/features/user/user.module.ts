import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountInfoComponent } from './account-info/account-info.component';


export const routes = [
    { path: '', pathMatch: 'full', redirectTo: 'account-info' },
    { path: 'account-info', component: AccountInfoComponent }
];


@NgModule({
    declarations: [
        AccountInfoComponent
    ],
  imports: [
      CommonModule,
      FlexLayoutModule,
      MatIconModule,
      MatInputModule,
      MatButtonModule,
      ReactiveFormsModule,
      RouterModule.forChild(routes)
  ]
})
export class UserModule { }
