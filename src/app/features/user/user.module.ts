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
import { RouteMessageModule } from '../../ui/route-message/route-message.module';


export const routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account-info' },
  { path: 'account-info', component: AccountInfoComponent },
  { path: 'profile-image', component: ProfileImageComponent }
];

@NgModule({
  declarations: [
    AccountInfoComponent,
    ProfileImageComponent,
    ImageUploaderComponent
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
    ReactiveFormsModule,
    RouteMessageModule,
    AlertModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
