// SE encarga de comunicarse con nuestra API
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient ) { }

  login( formData: loginForm) {
    console.log('Login desde el Usuario.service', formData);
    return this.http.post(`${environment.base_url}/login`, formData);
  }

  validarToken() {

    const token = localStorage.getItem('token') || '';
    if ( token === '') {
      return of(false);
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
        console.log('Token renovado');
      }),
      // devuelve algo que es del mismo tipo que el get,en este caso un observable
      map ( res => {
        return true;
      }),
      catchError ( err => {
        console.warn(err);
        // of permite devolver valor true o false en forma de observable
        return of(false);
      })
    );

  }

}
