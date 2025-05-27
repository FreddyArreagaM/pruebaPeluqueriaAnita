import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
// import { UserService } from 'src/app/services/user/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Cliente {
  id: number;
  nombre: string;
  cedula?: string;
  telefono?: string;
  email?: string;
  fecha_registro?: string; // ISO string
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator; //Se bindea con los componentes del html
  @ViewChild('dialogCreateCustomer') dialogTemplate!: TemplateRef<any>;
  displayedColumns: string[] = ['name', 'dni' ,'email', 'telefono', 'createdDate'];
  dataSource: Cliente[] = [];
  listCliente: Cliente[] = [];
  dataCliente = new MatTableDataSource<Cliente>();
  searchTerm: string = '';
  isDesktop!: boolean; // Manejo de tipo de dispositivo
  noResults: boolean = false;
  customerForm!: FormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _clienteService: ClienteService,
    private _toastService: ToastrService
  ) {
    this.customerForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    this.checkDeviceType();
    await this.loadData();
  }

  onResize(event: Event): void {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  // Método para obtener la lista de clientes y cargarlos en la tabla
  async loadData() {
    await this._clienteService.getAllCustomers().subscribe((data: any) => {
      const formatearFecha = (fechaIso: string): string => {
        const fecha = new Date(fechaIso);
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      this.dataCliente = new MatTableDataSource<Cliente>(
        data.map((element: any) => {
          const { id, nombre, cedula, email, telefono, fecha_registro } = element;
          return {
            id,
            nombre,
            cedula,
            email,
            telefono,
            fecha_registro: formatearFecha(fecha_registro),
          };
        })
      );

      this.dataSource = this.dataCliente.data;
      this.dataCliente.paginator = this.paginator;
      this.listCliente = this.dataCliente.data;
    });
  }

  // Método para verificar si no hay resultados
  checkNoResults() {
    this.noResults = this.dataCliente.filteredData.length === 0;
  }

  // Método para abrir el diálogo de creación de usuario
  openCreateClienteDialog() {
    this.dialog.open(this.dialogTemplate, {
      width: '600px',
      height: 'auto',
      data: '',
    });
  }

  saveCustomer() {
    if (this.customerForm.valid) {
      // Objeto cliente con los datos del formulario
      const cliente = {
        nombre: this.customerForm.get('nombre')?.value,
        cedula: this.customerForm.get('cedula')?.value,
        email: this.customerForm.get('email')?.value,
        telefono: this.customerForm.get('telefono')?.value,
      };

      // Llamado al servicio de cliente para agregar un nuevo usuario
      this._clienteService.addCustomer(cliente).subscribe(
        (data) => {
          this._toastService.success(
            'Cliente creado correctamente',
            'Correcto',
            {
              progressBar: true,
              timeOut: 2000,
              progressAnimation: 'decreasing',
            }
          );
          this.dialog.closeAll();
          this.loadData();
          this.customerForm.reset();
        },
        (error) => {
          if (error.status === 200 || error.status === 201) {
          } else {
            this._toastService.error(
              error.error.substring(error.error.indexOf(':') + 2),
              ' Notificación ',
              {
                progressBar: true,
                timeOut: 2000,
                progressAnimation: 'decreasing',
              }
            );
          }
        }
      );
    }
    // Validación de campos del formulario de cliente
    else {
      this._toastService.error('Por favor, ingrese todos los campos', 'Error', {
        progressBar: true,
        timeOut: 2000,
        progressAnimation: 'decreasing',
      });
    }
  }
}
