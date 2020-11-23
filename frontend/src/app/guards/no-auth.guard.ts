import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  // Para utilizarlo que hay en service hay que inyectarlo en el constructor
  // Si no existe se crea
  constructor( private usuarioService: UsuarioService,
               private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    // Pipe -> coge todo lo que venga y haz una operación con ello
    // Tap -> forma de decir que se ejecuten operaciones secundarias
    // Para poder realizar operaciones asíncronas,forma de decir, pipe
    // recoge resultado y se lo pasa a tap (operacion en segundo paso)
    // se pueden añadir muchos taps
    return this.usuarioService.validarNoToken()
            .pipe( // cuando se ejecute validarToken,se ejecuta esto,en este caso necesario para redirigir
              tap( res => {
                if (!res) {
                  this.router.navigateByUrl('/dashboard');
                }
              })
            );
  }

}
