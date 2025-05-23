import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

export interface Cita {
  id: number;
  clienteId: number;
  fecha: string; // ISO string
  estado: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
  observaciones?: string;
}


@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'],
})
export class CitasComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator; //Se bindea con los componentes del html
  @ViewChild('dialogCreateCitas') dialogTemplate!: TemplateRef<any>;
  displayedColumns: string[] = ['name', 'email', 'telefono', 'createdDate'];
  dataSource: Cita[] = [];
  listUser: Cita[] = [];
  dataUser = new MatTableDataSource<Cita>();
  searchTerm: string = '';
  isDesktop!: boolean; // Manejo de tipo de dispositivo
  noResults: boolean = false;

  constructor(
    private dialog: MatDialog,
    // private _userService: UserService,
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

  // Método para obtener la lista de clientes y cargarlos en la tabla
  async loadData() {
    /* await this._userService.getAllUsers().subscribe((data: any) => { 
      this.dataUser = new MatTableDataSource<User>(data.map((element: any) => {
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
      this.dataSource = this.dataUser.data;
      this.dataUser.paginator = this.paginator;
      this.listUser = this.dataUser.data;
    }); */
  }

  // Método para verificar si no hay resultados
  checkNoResults() {
    this.noResults = this.dataUser.filteredData.length === 0;
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
