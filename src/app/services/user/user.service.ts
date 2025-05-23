import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
    // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Metodo para obtener todos los usuarios
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios`);
  }

  // Metodo para agregar un nuevo usuario
  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, user);
  }

}
