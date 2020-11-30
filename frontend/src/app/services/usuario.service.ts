// SE encarga de comunicarse con nuestra API
// Solo interesa tener el token en el Localstorage, lo demás es manipulable

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  // al ser privada son necesario los getters
  private usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router ) { }


  nuevoUsuario ( data: Usuario) {
    return this.http.post(`${environment.base_url}/usuarios/`, data, this.cabeceras);
  }

  actualizarUsuario ( uid: string, data: Usuario ) {
    return this.http.put(`${environment.base_url}/usuarios/${uid}`, data, this.cabeceras);
  }

  cambiarPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/usuarios/np/${uid}`, data, this.cabeceras);
  }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/uploads/fotoperfil/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/uploads/fotoperfil/${uid}`, datos, this.cabeceras);
  }

  cargarUsuario( uid: string ) {
    if (!uid) { uid = ''; }
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}`, this.cabeceras);
  }

  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  borrarUsuario( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/usuarios/${uid}` , this.cabeceras);
  }

  cargarListaUsuarios ( uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/usuarios/lista` , data, this.cabeceras);
  }

  cargarUsuariosRol ( rol: string, uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/usuarios/rol/${rol}`, data, this.cabeceras);
  }

  login( formData: loginForm ) {
    return this.http.post(`${environment.base_url}/login`, formData)
            .pipe(
              tap( ( res : any) => {
                localStorage.setItem('token', res['token']);
                //localStorage.setItem('rol', res['rol']); // Esto no es peligroso para la seguridad ??
                const { uid, rol } = res;
                this.usuario = new Usuario(uid, rol);
              })
            );
  }

  logout() {
    this.limpiarLocalStore();
    this.router.navigateByUrl('/login');
  }


  validar( correcto: boolean, incorrecto: boolean): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    if ( token === '') {
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    // Hay que subscribirse, pero aquí no, así que por eso devolvemos el get
    // Siempre que queramos recoger el resultado de un observable (llamada asincrona)
    // se hace mediante un pipe
    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras )
      .pipe(
        // si es correcto ejecuto tap y map
        tap( (res: any) => {
          // extaemos los datos que nos ha devuelto y los guardamos en el usurio y en localstore
          const { uid, nombre, apellidos, email, rol, alta, activo, imagen, token} = res;
         // console.log('(validar -> usuario.service.ts)', res);
         // console.log('USUARIO ID (validar -> usuario.service.ts): ', uid);
          localStorage.setItem('token', token);
          this.usuario = new Usuario(uid, rol, nombre, apellidos, email, alta, activo, imagen);
        //  console.log('(validar -> usuario.service.ts)', this.usuario);
        }),
        // devuelve algo que es del mismo tipo que el get,en este caso un observable
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          console.warn(err);
          // of permite devolver valor true o false en forma de observable
          this.limpiarLocalStore();
          return of(incorrecto);
        })
    );
  }


  validarToken(): Observable<boolean>{
    return this.validar(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
  }


  limpiarLocalStore(): void {
    localStorage.removeItem('token');
  }

  establecerimagen(nueva: string): void {
    this.usuario.imagen = nueva;
  }

  establecerdatos(nombre: string, apellidos: string, email: string): void {
    this.usuario.nombre = nombre;
    this.usuario.apellidos = apellidos;
    this.usuario.email = email;
  }


  crearImagenUrl( imagen: string) {

    const token = localStorage.getItem('token') || '';
    if (!imagen) {
      return `${environment.base_url}/uploads/fotoperfil/no-imagen?token=${token}`;
    }
    return `${environment.base_url}/uploads/fotoperfil/${imagen}?token=${token}`;
  }


  // GETTERS -> funcionan como una propiedad más, no hace falta usar los paréntisis para llamarlos
  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid;
  }

  get rol(): string {
    return this.usuario.rol;
  }

  get nombre(): string{
    return this.usuario.nombre;
  }

  get apellidos(): string{
    return this.usuario.apellidos;
  }

  get email(): string{
    return this.usuario.email;
  }

  get imagen(): string{
    return this.usuario.imagen;
  }

  get imagenURL(): string{
   // console.log('Estas es la imagen: ', this.usuario.imagenUrl);
    return this.usuario.imagenUrl;
  }


}
