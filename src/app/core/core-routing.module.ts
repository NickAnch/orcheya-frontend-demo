import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WrapperPage } from './pages/wrapper/wrapper.page';
import { LoginPage } from './pages/login/login.page';

const routes: Routes = [
  {
    path: '',
    component: WrapperPage,
    children: []
  },
  {
    path: 'login',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
