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
              })
            );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  validarToken(): Observable<boolean>{

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
        localStorage.removeItem('token');
        return of(false);
      })
    );

  }

  validarNoToken(): Observable<boolean> {

    const token = localStorage.getItem('token') || '';
    if ( token === '') {
      return of(true);
    }

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
        return false;
      }),
      catchError ( err => {
        console.warn(err);
        // of permite devolver valor true o false en forma de observable
        localStorage.removeItem('token');
        return of(true);
      })
    );

  }

}
