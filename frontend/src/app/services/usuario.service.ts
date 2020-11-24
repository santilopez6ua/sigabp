// SE encarga de comunicarse con nuestra API
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient,
               private router: Router ) { }

  login( formData: loginForm ) {
    return this.http.post(`${environment.base_url}/login`, formData)
            .pipe(
              tap( res => {
                localStorage.setItem('token', res['token']);
                localStorage.setItem('rol', res['rol']); // Esto no es peligroso para la seguridad ??
              })
            );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigateByUrl('/login');
  }


  validar( correcto: boolean, incorrecto: boolean): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    if ( token === '') {
      return of(incorrecto);
    }

    // Hay que subscribirse, pero aquí no, así que por eso devolvemos el get
    // Siempre que queramos recoger el resultado de un observable (llamada asincrona)
    // se hace mediante un pipe
    return this.http.get(`${environment.base_url}/login/token`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      // si es correcto ejecuto tap y map
      tap( res => {
        localStorage.setItem('token', res['token']);
      }),
      // devuelve algo que es del mismo tipo que el get,en este caso un observable
      map ( res => {
        return correcto;
      }),
      catchError ( err => {
        console.warn(err);
        // of permite devolver valor true o false en forma de observable
        localStorage.removeItem('token');
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

}
