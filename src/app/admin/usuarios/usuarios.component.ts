import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { UserService } from 'src/app/services/user/user.service';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  rol: String;
}

export interface Role {
  id: string;
  name: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialogCreateCustomer') dialogTemplate!: TemplateRef<any>;
  displayedColumns: string[] = ['nombre', 'email', 'rol'];
  dataSource: Usuario[] = [];
  listUser: Usuario[] = [];
  dataUser = new MatTableDataSource<Usuario>();
  searchTerm: string = '';
  isDesktop!: boolean;
  noResults: boolean = false;
  userForm!: FormGroup;

  // Lista de roles
  roleList: Role[] = [
    { id: 'ADMIN', name: 'Administrador' },
    { id: 'CLIENTE', name: 'Cliente' },
  ];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _userService: UserService,
    private _customerService: ClienteService,
    private _toastService: ToastrService
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      rol: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.userForm.get('rol')?.setValue(null);
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

  // Método para obtener la lista de Usuarios y cargarlos en la tabla
  async loadData() {
    await this._userService.getAllUsers().subscribe((data: any) => {
      this.dataUser = new MatTableDataSource<Usuario>(
        data.map((element: any) => {
          const { id, nombre, email, rol } = element;
          return {
            id,
            nombre,
            email,
            rol: rol === 'ADMIN' ? 'Administrador' : 'Cliente',
          };
        })
      );
      this.dataSource = this.dataUser.data;
      this.dataUser.paginator = this.paginator;
      this.listUser = this.dataUser.data;
    });
  }

  // Método para verificar si no hay resultados
  checkNoResults() {
    this.noResults = this.dataUser.filteredData.length === 0;
  }

  // Método para abrir el diálogo de creación de usuario
  openCreateUserDialog() {
    this.dialog.open(this.dialogTemplate, {
      width: '600px',
      height: 'auto',
      data: '',
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      // Objeto user con los datos del formulario
      const user = {
        nombre: this.userForm.get('nombre')?.value,
        email: this.userForm.get('email')?.value,
        rol: this.userForm.get('rol')?.value,
        password: this.userForm.get('password')?.value,
      };

      if (user.rol === 'CLIENTE') {
        const customer = {
          nombre: user.nombre,
          email: user.email,
          telefono: '0000000000',
        };
        this._customerService.addCustomer(customer).subscribe(
          () => {},
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

        // Llamado al servicio de user para agregar un nuevo usuario
        this._userService.addUser(user).subscribe(
          (data) => {
            this._toastService.success(
              'Usuario creado correctamente',
              'Correcto',
              {
                progressBar: true,
                timeOut: 2000,
                progressAnimation: 'decreasing',
              }
            );
            this.dialog.closeAll();
            this.loadData();
            this.userForm.reset();
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
      // Validación de campos del formulario de user
      else {
        this._toastService.error(
          'Por favor, ingrese todos los campos',
          'Error',
          {
            progressBar: true,
            timeOut: 2000,
            progressAnimation: 'decreasing',
          }
        );
      }
    }
  }
}
