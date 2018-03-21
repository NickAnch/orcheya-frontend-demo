import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentUserGuard } from './services/current-user.guard';

import { WrapperPage } from './pages/wrapper/wrapper.page';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { UserProfilePage } from './pages/user-profile/user-profile.page';
import { UsersListPage } from './pages/users-list/users-list.page';

const routes: Routes = [
  {
    path: '',
    component: WrapperPage,
    canActivate: [CurrentUserGuard],
    children: [
      { path: 'user-profile', component: UserProfilePage },
      { path: 'users-list', component: UsersListPage },
    ]
  },
  { path: 'sign-in', component: SignInPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
