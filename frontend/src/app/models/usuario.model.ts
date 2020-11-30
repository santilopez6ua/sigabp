/*******************************
 * Utilizamos en lugar de interfaz
 * Modelo es una clase con constructor y que puede tener métodos
 * Mis propiedades que las de la Base de datos
 * Para crearlo -> usu1: Usuario = new Usuario ('aa','aa',...)
 * Va a almacenar información
 */


import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Usuario {

    constructor( public uid: string,
                 public rol: string,
                 public nombre?: string,
                 public apellidos?: string,
                 public email?: string,
                 public alta?: Date,
                 public activo?: boolean,
                 public imagen?: string) {}

    // getter actúa como una propiedad más, y se accede igual
    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/uploads/fotoperfil/no-imagen?token=${token}`;
        }
        return `${base_url}/uploads/fotoperfil/${this.imagen}?token=${token}`;
    }
}
