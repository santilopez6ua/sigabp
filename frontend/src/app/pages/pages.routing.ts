import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

// Pasar info a ruta con data:
const routes: Routes = [
  {
    path: 'dashboard', component: AdminLayoutComponent, canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardComponent, data: {
                                                          titulo: 'Dashboard', // siempre se genera
                                                          breadcrumbs: [],
                                                        }},
      { path: 'usuarios', component: UsuariosComponent, data: {
                                                          titulo: 'Usuarios',
                                                          breadcrumbs: [{titulo: 'Dashboard', url: '/dashboard'}]
                                                        }},
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
