import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AtencionService } from 'src/app/services/atencion/atencion.service';

export interface Atencion {
  id: number;
  citaId: number;
  fecha: string; 
  total?: number;
  servicios: DetalleAtencion[];
}

export interface DetalleAtencion {
  id: number;
  atencionId: number;
  servicioId: number;
  cantidad: number;
  subtotal?: number;
  servicio?: Servicio;
}

export interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  duracionMinutos?: number;
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
  listUser: Atencion[] = [];
  dataAtencion = new MatTableDataSource<Atencion>();
  searchTerm: string = '';
  isDesktop!: boolean;
  noResults: boolean = false;

  constructor(
    private dialog: MatDialog,
    private _atencionService: AtencionService,
    private _toastService: ToastrService
  ) {}

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
    /* await this._userService.getAllUsers().subscribe((data: any) => { 
      this.dataAtencion = new MatTableDataSource<User>(data.map((element: any) => {
        const { id, name, email, gender, role, position, status, phone_number } = element;
        return {
          id,
          name,
          email,
          gender: gender === 'male' ? 'Masculino' : 'Femenino',
          role: role === 'admin' ? 'Administrador' : 'Usuario',
          status: status === 'true' ? 'Activo' : 'Inactivo',
          position,
          phone_number
        };
      }));
      this.dataSource = this.dataAtencion.data;
      this.dataAtencion.paginator = this.paginator;
      this.listUser = this.dataAtencion.data;
    }); */
  }

  // Método para verificar si no hay resultados
  checkNoResults() {
    this.noResults = this.dataAtencion.filteredData.length === 0;
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

  // Método para abrir el diálogo de edición de usuario
  openEditUserDialog(element: any, element_id: any) {
    /*     const dialogRef = this.dialog.open(UserCreateDialogComponent,{
      width: "600px",
      height: "auto",
      data: [element_id, element],
    }).afterClosed().subscribe(async result => {
      if(result === 'updated'){
        await this.loadData();
      }
    }); */
  }
}
