import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public formSubmit = false;

  public loginForm = this.fb.group({ // nos permite crear objeto de tipo FB,con grupos de campos
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ], // si fuese solo una condicion,sin corchetes
    password: ['', Validators.required],
    remember: [ false || localStorage.getItem('email') ]
  });

  constructor( private fb: FormBuilder, // inyectamos la clase para poder utilizarla
               private usuarioService: UsuarioService, // necesario declarar servicio
               private router: Router ) { } // permite cambiar URL en la que estamos

  ngOnInit(): void {
  }

  login() {
    this.formSubmit = true;

    console.log(this.loginForm);
    if (!this.loginForm.valid) {
      console.warn('Errores en el formulario');
    }

    this.usuarioService.login(this.loginForm.value)
      .subscribe( res => {    // es necesario subcribirse al tratarse de un objeto asincrono
        console.log('Respuesta al subscribe:', res);

        localStorage.setItem('token', res['token']);

        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/dashboard');

      }, (err) => {
        console.warn('Error respuesta api: ', err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Ok',
          backdrop: false
        });
      }); // si hay error
  }

  campoValido( campo: string ) {

    return this.loginForm.get(campo).valid || !this.formSubmit;
  }

}
