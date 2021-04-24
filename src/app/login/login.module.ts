import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthModule } from 'carey-auth';

export const routes = [
    { path: '', component: LoginComponent }
];


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    AuthModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
