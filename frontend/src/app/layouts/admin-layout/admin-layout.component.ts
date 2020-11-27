import { Component, OnInit } from '@angular/core';

// declaracion del nombre de una funcion,ya que aunque iniciarCustom existe de manera global
// no se reconoce. Le decimos que se fie de nosotros
declare function iniciarCustom();
declare function iniciarSidebarmenu();

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    iniciarCustom();
    iniciarSidebarmenu();
  }

}
