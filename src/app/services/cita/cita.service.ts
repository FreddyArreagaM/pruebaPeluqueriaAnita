import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

    // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Metodo para obtener todos las citas
  getAllCitas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/citas`);
  }

  // Metodo para agregar una nueva cita
  addCita(cita: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/citas`, cita);
  }
  
  // update estado cita 
  updateCitaEstado(citaId: number, estado: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/citas/${citaId}/estado`, { estado });
  }
}
