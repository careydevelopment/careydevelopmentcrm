import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from '../../ui/alert/alert.module';
import { RouteMessageModule } from '../../ui/route-message/route-message.module';

export const routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account-info' },
  { path: 'add-contact', component: AddContactComponent }
];

@NgModule({
  declarations: [
    ContactFormComponent,
    AddContactComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouteMessageModule,
    AlertModule,
    RouterModule.forChild(routes)
  ]
})

export class ContactsModule { }
