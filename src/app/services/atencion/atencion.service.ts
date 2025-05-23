import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtencionService {

    // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Metodo para obtener todos las atenciones
  getAllAtenciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/atenciones`);
  }

  // Metodo para agregar una nueva atencion
  addAtencion(atencion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/atenciones`, atencion);
  }
}
