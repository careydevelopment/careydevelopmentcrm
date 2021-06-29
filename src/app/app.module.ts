import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MenuListItemComponent } from './features/ui/menu-list-item/menu-list-item.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeaturesComponent } from './features/features.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './ui/confirmation-dialog/confirmation-dialog.component';
import { JwtInterceptor } from './util/jwt-interceptor';
import { HttpErrorInterceptor } from './util/http-error-interceptor';
import { MatNativeDateModule } from '@angular/material/core';
import { BreadcrumbModule } from './ui/breadcrumb/breadcrumb.module';
import { UserModule } from 'carey-user';
import { environment } from '../environments/environment';
import { AuthModule } from 'carey-auth';
import { GeoModule } from 'carey-geo';
import { ValidationModule } from 'carey-validation';
import { allFieldSummaries } from './config/validation/field-summaries';

@NgModule({
  declarations: [
    AppComponent,
    MenuListItemComponent,
    FeaturesComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatNativeDateModule,
    BreadcrumbModule,
    UserModule.forRoot({ baseUrl: environment.baseUserServiceUrl }),
    AuthModule.forRoot({ baseUrl: environment.baseUserServiceUrl }),
    GeoModule.forRoot({ baseUrl: environment.baseGeoServiceUrl }),
    ValidationModule.forRoot({ fieldSummaries : allFieldSummaries })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }
