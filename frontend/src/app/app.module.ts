/*
* En este archivo se importan los componentes que creamos,
* pero se ha modularizado, por lo que auth y pages se encargane
* de importar sus propios componentes
* También se importa el archivo principal de routing
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragulaModule} from 'ng2-dragula';

import { AuthModule } from './auth/auth.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { FooterComponent } from './commons/footer/footer.component';
import { PagesModule } from './pages/pages.module';
import { CommonsModule } from './commons/commons.module';


@NgModule({
  declarations: [
    AppComponent,
   // FooterComponent,
  ],
  imports: [ // todos los modulos se importan
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    CommonsModule,
    DragulaModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
// me permite poder utilizar componentes hijo
