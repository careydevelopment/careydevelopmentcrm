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
import { ImageUploaderComponent } from '../ui/image-uploader/image-uploader.component';
import { AlertModule } from '../../ui/alert/alert.module';
import { InboxComponent } from './email/inbox/inbox.component';
import { EmailService } from './email/service/email.service';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MessageComponent } from './email/message/message.component';
import { NoSanitizePipe } from '../../util/nosanitizepipe';


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
    ImageUploaderComponent,
    InboxComponent,
    MessageComponent,
    NoSanitizePipe
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
    ReactiveFormsModule,
    AlertModule,
    RouterModule.forChild(routes)
  ],
  providers: [EmailService]
})
export class UserModule { }
