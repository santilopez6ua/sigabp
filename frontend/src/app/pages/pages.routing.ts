import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [
  {
    path: 'dashboard', component: AdminLayoutComponent, canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardComponent }, // siempre se genera
      { path: 'usuarios', component: UsuariosComponent },
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})



export class PagesRoutingModule { }
