import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountInfoComponent } from './account-info/account-info.component';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { ImageUploaderModule } from 'carey-image-uploader';
import { InboxComponent } from './email/inbox/inbox.component';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MessageComponent } from './email/message/message.component';
import { NoSanitizePipe } from '../../util/nosanitizepipe';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ComposeEmailComponent } from './email/compose-email/compose-email.component';
import { QuillModule } from 'ngx-quill';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AlertModule } from 'carey-alert';
import { EmailChoiceComponent } from './email/email-choice/email-choice.component';
import { EmailRedirectComponent } from './email/email-redirect/email-redirect.component';
import { EmailService } from './email/service/email.service';

export const routes = [
  {
    path: 'email/inbox',
    component: InboxComponent,
    data: {
      breadcrumb: 'View Inbox'
    }
  },
  {
    path: 'email/message',
    component: MessageComponent,
    data: {
      breadcrumb: 'Read Email'
    }
  },
  {
    path: 'email/redirect',
    component: EmailRedirectComponent,
    data: {
      breadcrumb: ''
    }
  },
  {
    path: 'email/compose-email',
    component: ComposeEmailComponent,
    data: {
      breadcrumb: 'Compose Email'
    }
  },
  {
    path: 'email/email-choice',
    component: EmailChoiceComponent,
    data: {
      breadcrumb: 'Choose Email'
    }
  },
  {
    path: 'account-info',
    component: AccountInfoComponent,
    data: {
      breadcrumb: 'Account Info'
    }
  },
  {
    path: 'profile-image',
    component: ProfileImageComponent,
    data: {
      breadcrumb: 'Profile Image'
    }
  }
];

@NgModule({
  declarations: [
    AccountInfoComponent,
    ProfileImageComponent,
    InboxComponent,
    MessageComponent,
    NoSanitizePipe,
    ComposeEmailComponent,
    EmailChoiceComponent,
    EmailRedirectComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatStepperModule,
    MatRadioModule,
    MatExpansionModule,
    MatMenuModule,
    MatToolbarModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    AlertModule,
    ImageUploaderModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
