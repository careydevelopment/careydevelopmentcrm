import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    {
        path: '',
        component: FeaturesComponent,
        children: [
          { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
          { path: 'user', canActivate: [AuthGuard], loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
          { path: 'contacts', canActivate: [AuthGuard], loadChildren: () => import('./features/contacts/contacts.module').then(m => m.ContactsModule) },
          { path: 'accounts', canActivate: [AuthGuard], loadChildren: () => import('./features/accounts/accounts.module').then(m => m.AccountsModule) },
          { path: 'activities', canActivate: [AuthGuard], loadChildren: () => import('./features/activities/activities.module').then(m => m.ActivitiesModule) },
          { path: 'deals', canActivate: [AuthGuard], loadChildren: () => import('./features/deals/deals.module').then(m => m.DealsModule) }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
    ],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
