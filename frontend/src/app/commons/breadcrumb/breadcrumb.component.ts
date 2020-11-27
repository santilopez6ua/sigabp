import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  public titulo: string = '';
  public breadcrumbs: any[];
  private subs$: Subscription; // $ indica que va a ser una variable especial,se tipa
  // Router genera eventos cada que se cambia de ruta
  // Observable, objeto a lo que te puedes subscribir para cambios
  // Cuando te subscribes a algo, recibes un argumento
  constructor( private router: Router) {
    // dentro de subs puedo manejar subscripcion
    this.subs$ = this.cargarDatos()
                      .subscribe( data => {
                        this.titulo = data.titulo;
                        this.breadcrumbs = data.breadcrumbs;
                      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

  cargarDatos() {
    return this.router.events
      // en pipe se realiza operacion, se pasa a la siguiente y se devuelve lo que da la ultima
      .pipe(
        // Filtrar eventos, solo pasa Activation End
        // En lugar de con if, se puede hacer así
        // Si evento es instancia de activationend, es true y se devuelve event
        filter ( event => event instanceof ActivationEnd),
        filter ( (event: ActivationEnd) => event.snapshot.firstChild === null),
        // filter es equivalente a: if (event.snapshot.firstChild === null) return event;
        // devolver parte del evento con map, map transforma datos
        map ( (event: ActivationEnd) => event.snapshot.data)
      )
  }
}
