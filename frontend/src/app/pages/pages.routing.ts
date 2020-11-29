import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { DashboardprofComponent } from './prof/dashboardprof/dashboardprof.component';
import { DashboardaluComponent } from './alu/dashboardalu/dashboardalu.component';
import { PerfilComponent } from './perfil/perfil.component';

/*
  /perfil                               [*]
  /admin/* --> páginas de administrador [ROL_ADMIN]
  /prof/*  --> páginas de profesor      [ROL_PROFESOR]
  /alu/*   --> páginas de alumno        [ROL_ALUMNO]

  data --> pasar informacion junto a la ruta para breadcrums y para AuthGuard {rol: 'ROL_ADMIN/ROL_PROFESOR/ROL_ALUMNO/*'}
  el rol lo manejamos en las guardas
*/

// Pasar info a ruta con data:
const routes: Routes = [
  { path: 'perfil', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: '*'},
    children: [
      { path: '', component: PerfilComponent, data: {
                                    titulo: 'Perfil',
                                    breadcrums: []
                                  },},
    ]},
  { path: 'admin', component: AdminLayoutComponent, canActivate: [ AuthGuard], data: {rol: 'ROL_ADMIN'},
    children: [
    { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Dashboard',
                                                        breadcrums: []
                                                      },},
    { path: 'usuarios', component: UsuariosComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Usuarios',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'usuarios/usuario/:uid', component: UsuarioComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Usuario',
                                                        breadcrums: [ {titulo: 'Usuarios', url: '/admin/usuarios'} ],
                                                      },},

    { path: '**', redirectTo: 'dashboard'}
  ]},

  { path: 'prof', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_PROFESOR'},
    children: [
    { path: 'dashboard', component: DashboardprofComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_PROFESOR',
                                                        titulo: 'DashboardX',
                                                        breadcrums: []
                                                      },},
    { path: '**', redirectTo: 'dashboard'}
  ]},

  { path: 'alu', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_ALUMNO'},
    children: [
    { path: 'dashboard', component: DashboardaluComponent, canActivate: [ AuthGuard ], data: {
                                                        rol:'ROL_ALUMNO',
                                                        titulo: 'Dashboard',
                                                        breadcrums: []
                                                      },},
    { path: '**', redirectTo: 'dashboard'}
  ]},


];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
