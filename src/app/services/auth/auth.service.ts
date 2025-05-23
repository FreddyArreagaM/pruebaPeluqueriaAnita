import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

// URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Metodo para hacer login en la API
  login(email: string, password: string): Observable<any> {
    const body = { email, password };   
    return this.http.post<any>(`${this.apiUrl}/auth/login`, body);
  }

  // Metodo para obtener el usuario del local storage
  getUser(): Observable<any> {
    const user = localStorage.getItem('currentUser');
    return of(user);   
  }


  // Metodo para guardar el usuario en el local storage
  saveUser(user: string): void{
    localStorage.setItem('currentUser', user);   
  }  
}
