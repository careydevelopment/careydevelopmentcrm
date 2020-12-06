import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from '../../ui/alert/alert.module';
import { RouteMessageModule } from '../../ui/route-message/route-message.module';
import { BasicInfoFormComponent } from './contact-form/basic-info-form/basic-info-form.component';
import { AddressesFormComponent } from './contact-form/addresses-form/addresses-form.component';
import { PhonesFormComponent } from './contact-form/phones-form/phones-form.component';

export const routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account-info' },
  { path: 'add-contact', component: AddContactComponent }
];

@NgModule({
  declarations: [
    ContactFormComponent,
    AddContactComponent,
    BasicInfoFormComponent,
    AddressesFormComponent,
    PhonesFormComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatStepperModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouteMessageModule,
    AlertModule,
    RouterModule.forChild(routes)
  ]
})

export class ContactsModule { }
