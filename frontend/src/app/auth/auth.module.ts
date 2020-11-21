import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // necesario para que se reconozca a router outlet
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // formsmodule -> permite que cualquier formalurio
                                                                  // pueda manejarse desde angular
import { HttpClientModule } from '@angular/common/http';
                                                                  // reactiveFormsModule -> permite poder trabajar con formularios reactivos

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
  ],
  exports: [ // permite que pueda ser utiilizado fuera
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
  ],
  imports: [ // todos los modulos se importan
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AuthModule { }
