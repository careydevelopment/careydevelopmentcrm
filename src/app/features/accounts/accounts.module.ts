import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAccountComponent } from './add-account/add-account.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { AlertModule } from 'carey-alert';
import { NgxFlagPickerModule } from 'ngx-flag-picker';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DirectivesModule } from '../../directives/directives.module';
import { AccountFormComponent } from './account-form/account-form.component';
import { ViewAccountsComponent } from './view-accounts/view-accounts.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { ViewAccountComponent } from './view-account/view-account.component';
import { NoValueDisplayPipe } from '../../pipes/no-value-display.pipe';


export const routes = [
  {
    path: 'add-account',
    component: AddAccountComponent,
    data: {
      breadcrumb: 'Add Account'
    }
  },
  {
    path: 'view-accounts',
    component: ViewAccountsComponent,
    data: {
      breadcrumb: 'View Accounts'
    }
  },
  {
    path: 'edit-account',
    component: EditAccountComponent,
    data: {
      breadcrumb: 'Edit Account',
      pauseDisplay: true
    }
  },
  {
    path: 'view-account',
    component: ViewAccountComponent,
    data: {
      breadcrumb: 'View Account',
      pauseDisplay: true
    }
  }
];

@NgModule({
  declarations: [
    AddAccountComponent,
    AccountFormComponent,
    ViewAccountsComponent,
    EditAccountComponent,
    ViewAccountComponent,
    NoValueDisplayPipe
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    DirectivesModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatRadioModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatListModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AlertModule,
    NgxFlagPickerModule,
    RouterModule.forChild(routes)
  ]
})

export class AccountsModule { }
