import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CitaService } from 'src/app/services/cita/cita.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';

export interface Cita {
  id: number;
  cliente_id: number;
  fecha: string; // ISO string
  estado: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
  observaciones?: string;
}

export interface Estado {
  id: string;
  name: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  cedula?: string;
  telefono?: string;
  email?: string;
  fecha_registro?: string; // ISO string
}

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'],
})
export class CitasComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator; //Se bindea con los componentes del html
  @ViewChild('dialogCreateCitas') dialogTemplate!: TemplateRef<any>;
  displayedColumns: string[] = [
    'clienteId',
    'fecha',
    'estado',
    'observaciones',
  ];
  dataSource: Cita[] = [];
  listCita: Cita[] = [];
  dataCita = new MatTableDataSource<Cita>();
  searchTerm: string = '';
  isDesktop!: boolean; // Manejo de tipo de dispositivo
  noResults: boolean = false;
  dataSourceCliente: Cliente[] = [];
  customerList: Cliente[] = [];
  dataCliente = new MatTableDataSource<Cliente>();
  citaForm!: FormGroup;

  estadoList: Estado[] = [
    { id: 'REALIZADA', name: 'Realizada' },
    { id: 'PENDIENTE', name: 'Pendiente' },
    { id: 'CANCELADA', name: 'Cancelada' },
  ];
  cedulaBusqueda: string = '';

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _citaService: CitaService,
    private _clienteService: ClienteService,
    private _toastService: ToastrService
  ) {
    this.citaForm = this.fb.group({
      nombre: ['', Validators.required],
      fecha: ['', Validators.required],
      estado: ['', Validators.required],
      observaciones: ['', Validators.required],
    });

    this.citaForm.get('nombre')?.setValue(null);
    this.citaForm.get('estado')?.setValue(null);
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
    await this._citaService.getAllCitas().subscribe((data: any) => {
      const formatearFecha = (fechaIso: string): string => {
        const fecha = new Date(fechaIso);
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      this.dataCita = new MatTableDataSource<Cita>(
        data.map((element: any) => {
          const { id, cliente_id, fecha, estado, observaciones } = element;
          return {
            id,
            cliente_id,
            fecha: formatearFecha(fecha),
            estado,
            observaciones,
          };
        })
      );
      this.dataSource = this.dataCita.data;
      this.dataCita.paginator = this.paginator;
      this.listCita = this.dataCita.data;
    });

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
          const { id, nombre, cedula, email, telefono, fecha_registro } =
            element;
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

      this.dataSourceCliente = this.dataCliente.data;
      this.dataCliente.paginator = this.paginator;
      this.customerList = this.dataCliente.data;
    });
  }

  // Método para verificar si no hay resultados
  checkNoResults() {
    this.noResults = this.dataCita.filteredData.length === 0;
  }
  // Método para abrir el diálogo de creación de usuario
  openCreateUserDialog() {
    this.dialog
      .open(this.dialogTemplate, {
        width: '600px',
        height: 'auto',
        data: '',
      })
      .afterClosed()
      .subscribe(async (result) => {
        if (result === 'created') {
          await this.loadData();
        }
      });
  }

  saveCita() {
    if (this.citaForm.valid) {
      // Objeto cita con los datos del formulario
      const cita = {
        cliente_id: this.citaForm.get('nombre')?.value,
        fecha: this.citaForm.get('fecha')?.value,
        estado: this.citaForm.get('estado')?.value,
        observaciones: this.citaForm.get('observaciones')?.value,
      };


      // Llamado al servicio de cita para agregar una nueva cita
      this._citaService.addCita(cita).subscribe(
        (data) => {
          this._toastService.success('Cita creada correctamente', 'Correcto', {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          });
          this.dialog.closeAll();
          this.loadData();
          this.citaForm.reset();
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
    // Validación de campos del formulario de cita
    else {
      this._toastService.error('Por favor, ingrese todos los campos', 'Error', {
        progressBar: true,
        timeOut: 2000,
        progressAnimation: 'decreasing',
      });
    }
  }

  filterCitasByCedula(event: Event): void {
    const cedula = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!cedula) {
      this.dataCita.filterPredicate = () => true;
      this.dataCita.filter = '';
      this.checkNoResults();
      return;
    }

    // Buscar cliente que tenga esa cédula
    const cliente = this.dataSourceCliente.find((c) =>
      c.cedula?.toLowerCase().includes(cedula)
    );

    this.dataCita.filterPredicate = (data: Cita, filter: string): boolean => {
      return cliente ? data.cliente_id === cliente.id : false;
    };

    this.dataCita.filter = cliente
      ? cliente.id.toString()
      : Math.random().toString();
    this.checkNoResults();
  }
}
