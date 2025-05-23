import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

    // URL de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Metodo para obtener todos los clientes
  getAllCustomers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes`);
  }

  // Metodo para agregar un nuevo usuario
  addCustomer(customer: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes`, customer);
  }
}
