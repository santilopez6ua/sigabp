/*
* En este archivo se especifican las rutas de la aplicación,
* pero se ha modularizado para que pages y auth se encarguen
* de especificar sus propias rutas, de ahí que se importen
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';


const routes: Routes = [

  // /login y /recovery --> auth.routing.module
  // /dashboard/* --> pages.routing.module

  { path: '**', redirectTo: 'login'} // si me llega cualquier cosa, a login
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: [RouterModule]
})



export class AppRoutingModule { }
