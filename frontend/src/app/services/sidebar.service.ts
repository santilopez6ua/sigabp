import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: sidebarItem[] =[
    { titulo: 'Dashboard Admin', icono: 'fa fa-tachometer-alt', sub: false, url: '/admin/dashboard'},
    { titulo: 'Gestión usuarios', icono: 'fa fa-users', sub: false, url: '/admin/usuarios'},
  ];
  menuAlumno: sidebarItem[]=[
    { titulo: 'Dashboard Alumno', icono: 'fa fa-tachometer-alt', sub: false, url: '/alu/dashboard'},
  ];
  menuProfesor: sidebarItem[]=[
    { titulo: 'Dashboard Profesor', icono: 'fa fa-tachometer-alt', sub: false, url: '/prof/dashboard'},
  ];
  none: sidebarItem[]=[
    { titulo: 'error', icono: 'fa fa-exclamation-triangle', sub: false, url: '/error'}
  ]
  constructor( private usuarioService: UsuarioService) { }

  getmenu() {

    switch (this.usuarioService.rol) {
      case 'ROL_ADMIN':
        return this.menuAdmin;
      case 'ROL_PROFESOR':
        return this.menuProfesor;
      case 'ROL_ALUMNO':
        return this.menuAlumno;
    }

    return this.none;
  }
}
