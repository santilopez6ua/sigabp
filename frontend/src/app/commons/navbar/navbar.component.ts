import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  imagenUrl = '';

  constructor( private usuarioService: UsuarioService ) { }

  ngOnInit(): void {

   // console.log('ID: (navbar.component.ts)', this.usuarioService.uid);
    this.usuarioService.cargarUsuario( this.usuarioService.uid )
      .subscribe( res => {
      //  console.log('(navbar.component.ts)', res);
     //   console.log('imagenURL (navbar.component.ts):', this.imagenUrl);
        this.imagenUrl = this.usuarioService.imagenURL;
     //   console.log('imagenURL (navbar.component.ts):', this.imagenUrl);
      });
  }

  logout() {
    this.usuarioService.logout();
  }

}
