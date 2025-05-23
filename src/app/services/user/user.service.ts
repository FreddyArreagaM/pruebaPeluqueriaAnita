import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
    // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private _authService: AuthService) { }

  // Metodo para obtener todos los usuarios
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/getUsers`);
  }

  // Metodo para agregar un nuevo usuario
  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/signup`, user);
  }

  // Metodo para buscar un usuario por email
  findUserByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/user/getUserByEmail?email=${email}`;
    return this.http.get<any>(url);
  }
  
}
