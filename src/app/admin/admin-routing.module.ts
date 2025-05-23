import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { CitasComponent } from './citas/citas.component';
import { AtencionesComponent } from './atenciones/atenciones.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
    {
      path: '', redirectTo: 'usuarios', pathMatch: 'full'
    },
    {
      path: 'usuarios', component: UsuariosComponent
    }, 
    {
      path: 'clientes', component: ClientesComponent
    }, 
    {
      path: 'citas', component: CitasComponent
    }, 
    {
      path: 'atenciones', component: AtencionesComponent
    }, 
    { 
      path: '**', redirectTo:'usuarios', pathMatch:'full' 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
