import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitasComponent } from '../shared/citas/citas.component';

const routes: Routes = [
      {
        path: '', redirectTo: 'citas', pathMatch: 'full'
      },
      {
        path: 'citas', component: CitasComponent
      },  
      { 
        path: '**', redirectTo:'citas', pathMatch:'full' 
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
