import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentUserGuard } from './services/current-user.guard';
import { TimeDoctorResolver } from './services/time-doctor.resolver';

import { WrapperPage } from './pages/wrapper/wrapper.page';
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

const routes: Routes = [
  {
    path: '',
    component: WrapperPage,
    canActivate: [CurrentUserGuard],
    children: [
      {
        path: 'profile',
        resolve: { data: TimeDoctorResolver },
        component: UserProfilePage
      },
      {
        path: 'user-profile/:id',
        resolve: { data: TimeDoctorResolver },
        component: UserProfilePage
      },
      { path: 'users-list', component: UsersListPage },
      { path: '', component: UsersListPage },
      { path: 'users-list', component: UsersListPage }
    ]
  },
  { path: 'sign-in', component: SignInPage },
  {
    path: 'invitation/:token',
    component: AcceptInvitePage
  },
  {
    path: 'terms-and-conditions', component: TermsAndConditionsComponent
  },
  {
    path: 'registration', component: RegistrationComponent,
    canActivate: [RegistrationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
