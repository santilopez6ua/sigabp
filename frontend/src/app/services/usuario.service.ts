// SE encarga de comunicarse con nuestra API
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router ) { }

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
          //localStorage.setItem('token', res['token']);
          //localStorage.setItem('rol', res['rol']);
          // extaemos los datos que nos ha devuelto y los guardamos en el usurio y en localstore
          const { uid, nombre, apellidos, email, rol, alta, activo, imagen, token} = res;
          localStorage.setItem('token', token);
          this.usuario = new Usuario(uid, rol, nombre, apellidos, email, alta, activo, imagen);

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


  nuevoUsuario ( data: Usuario) {
    return this.http.post(`${environment.base_url}/usuarios/`, data, this.cabeceras);
  }

  actualizarUsuario ( uid: string, data: Usuario ) {
    return this.http.put(`${environment.base_url}/usuarios/${uid}`, data, this.cabeceras);
  }

  cargarUsuario( uid: string ) {
    if (!uid) { uid = ''; }
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}`, this.cabeceras);
  }

  cambiarPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/usuarios/np/${uid}`, data, this.cabeceras);
  }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/fotoperfil/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/fotoperfil/${uid}`, datos, this.cabeceras);
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
    return localStorage.getItem('uid') || '';
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
    return this.usuario.imagenUrl;
  }


}
