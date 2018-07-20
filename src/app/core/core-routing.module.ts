import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminModule } from '../admin/admin.module';
import { ReportsModule } from '../reports/reports.module';

import { CurrentUserGuard } from './services/current-user.guard';

import { CoreComponent } from './core.component';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { UserProfilePage } from './pages/user-profile/user-profile.page';
import { AcceptInvitePage } from './pages/accept-invite/accept-invite.page';
import { UsersListPage } from './pages/users-list/users-list.page';
import {
  TermsAndConditionsComponent
} from './pages/terms-and-conditions/terms-and-conditions.component';

import {
  RegistrationComponent
} from './pages/registration/registration.component';
import { RegistrationGuard } from './services/registration.guard';
import { PermissionGuard } from './services/permission.guard';
import { UpdatesPage } from './pages/updates/updates.page';
import { IntegrationsPage } from './pages/integrations/integrations.page';
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
      { path: 'admin', loadChildren: () => AdminModule },
      { path: 'reports', loadChildren: () => ReportsModule },
    ]
  },
  { path: 'sign-in', component: SignInPage },
  { path: 'invitation/:token', component: AcceptInvitePage },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  {
    path: 'registration',
    component: RegistrationComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
