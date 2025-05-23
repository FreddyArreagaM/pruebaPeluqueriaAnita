import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }) // Habilita el Service Worker
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }) // Configuración PWA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
