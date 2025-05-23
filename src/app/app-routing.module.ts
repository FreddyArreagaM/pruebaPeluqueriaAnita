import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponent } from './shared/shared/shared.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',  
    loadChildren: ()=> import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'admin',
    component: SharedComponent,  
    loadChildren: ()=> import('./admin/admin.module').then(m=>m.AdminModule)
  },
  { 
    path: '**', redirectTo:'auth', pathMatch:'full' 
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
