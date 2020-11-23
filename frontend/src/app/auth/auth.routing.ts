import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { NoAuthGuard } from '../guards/no-auth.guard';


const routes: Routes = [

  {
    path: 'login', component: AuthLayoutComponent, canActivate: [ NoAuthGuard ], // simplemente con poner /login se muestran los dos
    children: [
      { path: '', component: LoginComponent },
    ]
  },
  {
    path: 'recovery', component: AuthLayoutComponent, canActivate: [ NoAuthGuard ],
    children: [
      { path: '', component: RecoveryComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // son hijos del routing principal
  exports: [RouterModule]
})



export class AuthRoutingModule { }
