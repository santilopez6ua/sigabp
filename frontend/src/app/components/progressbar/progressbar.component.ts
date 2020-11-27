import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css']
})
export class ProgressbarComponent implements OnInit {
  // Hace que propiedad se pueda establecer en su selector
  // Nombre público es valor,internamente ancho
  @Input('valor') ancho: number = 0;

  // eventemiiter -> emite eventos
  @Output('nombreEvento') salida: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  accion() {
    console.log('accion');
    this.ancho += 1;
    this.salida.emit(this.ancho);
  }
}
