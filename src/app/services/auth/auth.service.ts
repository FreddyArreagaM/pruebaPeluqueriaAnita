import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };   
    return this.http.post<any>(`${this.apiUrl}/user/login`, body, { headers });
  }

  //TestAPI 
  test(): Observable<string>{
    return this.http.get(`${this.apiUrl}/user/testAPI`, { responseType: 'text' });
  }
}
