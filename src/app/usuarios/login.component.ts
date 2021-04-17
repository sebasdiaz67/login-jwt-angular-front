import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Usuario } from './clases/usuario';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'Bienvenidos - evaluacion Megaprofer';
  usuario: Usuario;
  mostrarFormulario: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      swal.fire('Login', `Hola ${this.authService.usuario.nombreUsuario} ya estás autenticado!`, 'info');
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.nombreUsuario == null || this.usuario.contrasenia == null) {
      swal.fire('Error Login', 'Username o password vacías!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      this.authService.guardarUsuario(response.token);
      this.authService.guardarToken(response.token);
      const usuario = this.authService.usuario;
      swal.fire('Login', `Hola ${usuario.nombreUsuario}, has iniciado sesión con éxito!`, 'success');
    }, err => {
      if (err.status === 400 || err.status === 403) {
        swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
      }
    });
  }

  crearUsuario() {
    this.usuario = new Usuario();
    this.mostrarFormulario = true;
  }

  guardar() {
    if (this.usuario.identificacion == undefined || this.usuario.identificacion.length !== 10) {
      swal.fire('Error', 'Identificacion debe contener 10 caracteres!', 'error');
      return;
    }
    if (this.usuario.nombreUsuario == undefined || (this.usuario.nombreUsuario.trim().length < 4 || this.usuario.nombreUsuario.trim().length > 8)) {
      swal.fire('Error', 'Usuario debe estar entra 4 y 8 caracteres!', 'error');
      return;
    }
    if (this.usuario.contrasenia == undefined || this.usuario.contrasenia.trim().length < 8) {
      swal.fire('Error', 'Contrasena debe contener minimo 8 caracteres', 'error');
      return;
    }
    if (this.usuario.edad == undefined || this.usuario.edad < 18) {
      swal.fire('Error', 'Debe ser mayor de edad', 'error');
      return;
    }
    const usuarioDto = {
      identificacion: this.usuario.identificacion,
      nombre: this.usuario.nombre,
      nombreUsuario: this.usuario.nombreUsuario.trim().toLowerCase(),
      contrasenia: this.usuario.contrasenia,
      edad: this.usuario.edad,
      ciudad: this.usuario.ciudad == undefined ? null : this.usuario.ciudad
    };
    this.authService.guardar(usuarioDto).subscribe(response => {
      console.log(response);
      swal.fire('Usuario', `Hola ${response.nombreUsuario}, creado con éxito!`, 'success');
      this.cancelar();
    }, err => {
      if (err.status === 400 || err.status === 403) {
        swal.fire('Error', 'Ocurrio un error inesperado', 'error');
      }
    });
  }

  cancelar() {
    this.usuario = new Usuario();
    this.mostrarFormulario = false;
  }
}
