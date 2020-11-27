import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: sidebarItem[] = [
    { titulo: 'Dashboard Admin', icono: 'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    { titulo: 'Gestión usuarios', icono: 'mdi mdi-arrow-down', sub: true, subMenu: [
      { titulo: 'Usuarios', icono: 'mdi mdi-account', url: '/dashboard/usuarios'},
      { titulo: 'Opcion 2', icono: 'mdi mdi-numeric-2-box-outline', url: '/dashboard/dos'}
    ]},
    { titulo: 'Otro', icono: 'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'},
  ];

  menuAlumno: sidebarItem[] = [
    { titulo: 'Dashboard Alumno', icono: 'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    { titulo: 'Usuarios', icono: 'mdi mdi-account', sub: false, url: '/dashboard/usuarios'},
    { titulo: 'Otro', icono: 'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'},
    { titulo: 'Submenu', icono: 'mdi mdi-arrow-down', sub: true, subMenu: [
      { titulo: 'Opcion 1', icono: 'mdi mdi-numeric-1-box-outline', url: '/dashboard/uno'},
      { titulo: 'Opcion 2', icono: 'mdi mdi-numeric-2-box-outline', url: '/dashboard/dos'}
    ]},
  ];

  menuProfesor: sidebarItem[] = [
    { titulo: 'Dashboard Profesor', icono: 'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    { titulo: 'Usuarios', icono: 'mdi mdi-account', sub: false, url: '/dashboard/usuarios'},
    { titulo: 'Otro', icono: 'mdi mdi-multiplication', sub: false, url: '/dashboard/otro'},
    { titulo: 'Submenu', icono: 'mdi mdi-arrow-down', sub: true, subMenu: [
      { titulo: 'Opcion 1', icono: 'mdi mdi-numeric-1-box-outline', url: '/dashboard/uno'},
      { titulo: 'Opcion 2', icono: 'mdi mdi-numeric-2-box-outline', url: '/dashboard/dos'}
    ]},
  ];

  constructor() { }

  getmenu() {
    const rol = localStorage.getItem('rol');

    switch (rol) {
      case 'ROL_ADMIN':
        return this.menuAdmin;
      case 'ROL_PROFESOR':
        return this.menuProfesor;
      case 'ROL_ALUMNO':
        return this.menuAlumno;
    }

    return [];
  }
}
