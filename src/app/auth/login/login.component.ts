import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

function domainValidator(domains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values
    }

    const email = control.value;
    const isValidDomain = domains.some((domain) =>
      email.endsWith(`@${domain}`)
    );

    return isValidDomain ? null : { invalidDomain: true };
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  loading = false;
  subscriptionUser: Subscription = new Subscription();
  subscriptionLogin: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _toastr: ToastrService,
    private _loginService: AuthService,
    private _userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          domainValidator(['gmail.com', 'outlook.com', 'hotmail.com']),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Metodo para desuscribir los observables
  ngOnDestroy(): void {
    this.subscriptionLogin.unsubscribe();
  }

  // Metodo para loguear al usuario
  login() {
    this.loading = true;
    // Validamos el formulario
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      // Mostramos un mensaje de carga
      setTimeout(() => {
        // Llamamos al servicio de login para loguear al usuario
        this.subscriptionLogin = this._loginService
          .login(email, password)
          .subscribe(
            async (data) => {

              await this.sendUserDataLocalStorage(data);

              this._toastr.success('Bienvenido, Ingreso exitoso', 'Sistema', {
                progressBar: true,
                timeOut: 2000,
                progressAnimation: 'decreasing',
              });

              if (data.rol === 'ADMIN') {
                this._router.navigate(['/admin']);
              }
              // Si el usuario es user lo redirigimos a la pagina de productos
              else {
                this._router.navigate(['/client']);
              }
            },
            // Si el usuario no esta autorizado mostramos un mensaje de error
            (error) => {
              if (error.status === 0) {
                this._toastr.error(
                  'No se pudo conectar con el servidor',
                  'Sistema',
                  {
                    progressBar: true,
                    timeOut: 2000,
                    progressAnimation: 'decreasing',
                  }
                );
                this.loading = false;
              } else {
                this._toastr.error(error.error, 'Acceso Denegado', {
                  progressBar: true,
                  timeOut: 2000,
                  progressAnimation: 'decreasing',
                });
                this.loading = false;
              }
            }
          );
      }, 2000);
    }
    // Si el formulario es invalido mostramos un mensaje de error
    else {
      this.loading = false;
    }
  }

   // Metodo para procesar los datos del usuario
  async sendUserDataLocalStorage(data: any): Promise<void> {
    try {
        const userRole = data.rol;
        const user = {
          ...data,
          role: userRole
        };
        this._loginService.saveUser(JSON.stringify(user));
    } catch (error) {
      console.error('Error processing user data:', error);
    }
  }
}
