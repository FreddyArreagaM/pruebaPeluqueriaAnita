import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AtencionService } from 'src/app/services/atencion/atencion.service';
import { CitaService } from 'src/app/services/cita/cita.service';

export interface Atencion {
  id: number;
  cita_id: number;
  fecha: string;
  total?: number;
}

export interface Cita {
  id: number;
  clienteId: number;
  fecha: string;
  estado: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
  observaciones?: string;
}

@Component({
  selector: 'app-atenciones',
  templateUrl: './atenciones.component.html',
  styleUrls: ['./atenciones.component.css'],
})
export class AtencionesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialogCreateAtencion') dialogTemplate!: TemplateRef<any>;
  displayedColumns: string[] = ['numeroCita', 'fecha', 'total'];
  dataSource: Atencion[] = [];
  listAtencion: Atencion[] = [];
  dataAtencion = new MatTableDataSource<Atencion>();
  searchTerm: string = '';
  isDesktop!: boolean;
  noResults: boolean = false;
  atencionForm!: FormGroup;
  listaCitas: Cita[] = [];

  dataSourceCita: Cita[] = [];
  listCita: Cita[] = [];
  dataCita = new MatTableDataSource<Cita>();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _atencionService: AtencionService,
    private _citaService: CitaService,
    private _toastService: ToastrService
  ) {
    this.atencionForm = this.fb.group({
      citaId: ['', Validators.required],
      fecha: ['', Validators.required],
      total: ['', Validators.required],
    });

    this.atencionForm.get("citaId")?.setValue(null);
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

  // Método para obtener la lista de atenciones y cargarlas en la tabla
  async loadData() {
    await this._atencionService.getAllAtenciones().subscribe((data: any) => {
      const formatearFecha = (fechaIso: string): string => {
        const fecha = new Date(fechaIso);
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const dataOrdenada = data.sort(
        (a: any, b: any) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      this.dataAtencion = new MatTableDataSource<Atencion>(
        dataOrdenada.map((element: any) => {
          const { id, cita_id, fecha, total } = element;
          return {
            id,
            cita_id,
            fecha: formatearFecha(fecha),
            total,
          };
        })
      );
      this.dataSource = this.dataAtencion.data;
      this.dataAtencion.paginator = this.paginator;
      this.listAtencion = this.dataAtencion.data;
    });

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
      this.dataSourceCita = this.dataCita.data;
      this.dataCita.paginator = this.paginator;
      this.listCita = this.dataCita.data;
    });
  }

  // Método para verificar si no hay resultados
  checkNoResults() {
    this.noResults = this.dataAtencion.filteredData.length === 0;
  }
  // Método para abrir el diálogo de creación de atencion
  openCreateAtencionDialog() {
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

  saveAtencion() {
    if (this.atencionForm.valid) {
      // Objeto atencion con los datos del formulario
      const atencion = {
        citaId: this.atencionForm.get('citaId')?.value,
        fecha: this.atencionForm.get('fecha')?.value,
        total: this.atencionForm.get('total')?.value,
      };
      
      console.log("🚀 ~ AtencionesComponent ~ saveAtencion ~ atencion:", atencion)

      // Llamado al servicio de atencion para agregar una nueva atencion
      this._atencionService.addAtencion(atencion).subscribe(
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

          this._citaService.updateCitaEstado(atencion.citaId, 'REALIZADA').subscribe(()=> {
            this.dialog.closeAll();
            this.loadData();
            this.atencionForm.reset();
          });

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
    // Validación de campos del formulario de atenciones
    else {
      this._toastService.error('Por favor, ingrese todos los campos', 'Error', {
        progressBar: true,
        timeOut: 2000,
        progressAnimation: 'decreasing',
      });
    }
  }
}
