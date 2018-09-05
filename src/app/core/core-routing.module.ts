import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentUserGuard } from './services/current-user.guard';
import { RegistrationGuard } from './services/registration.guard';
import { PermissionGuard } from './services/permission.guard';
import { CoreComponent } from './core.component';
import {
  AcceptInvitePage,
  RegistrationPage,
  SignInPage,
  TermsAndConditionsPage,
  UpdatesPage,
  UserProfilePage,
  UsersListPage,
  IntegrationsPage,
} from './pages';
import { NewUpdatePage } from './pages/new-update/new-update.page';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    canActivate: [CurrentUserGuard, PermissionGuard],
    children: [
      { path: '', redirectTo: 'users-list', pathMatch: 'full' },
      { path: 'users-list', component: UsersListPage },
      { path: 'profile', component: UserProfilePage },
      { path: 'user-profile/:id', component: UserProfilePage },
      { path: 'updates', component: UpdatesPage },
      { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule' },
      {
        path: 'reports',
        loadChildren: 'app/reports/reports.module#ReportsModule'
      }
    ]
  },
  { path: 'sign-in', component: SignInPage },
  { path: 'invitation/:token', component: AcceptInvitePage },
  { path: 'terms-and-conditions', component: TermsAndConditionsPage },
  {
    path: 'registration',
    component: RegistrationPage,
    canActivate: [RegistrationGuard]
  },
  {
    path: 'integrations',
    component: IntegrationsPage,
    canActivate: [CurrentUserGuard, PermissionGuard]
  },
  {
    path: 'update',
    component: NewUpdatePage,
    canActivate: [CurrentUserGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
