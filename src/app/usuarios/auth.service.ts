import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './clases/usuario';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _usuario: Usuario;
    private _token: string;

    constructor(private http: HttpClient) { }

    public get usuario(): Usuario {
        if (this._usuario != null) {
            return this._usuario;
        } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
            this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
            return this._usuario;
        }
        return new Usuario();
    }

    public get token(): string {
        if (this._token != null) {
            return this._token;
        } else if (this._token == null && sessionStorage.getItem('token') != null) {
            this._token = sessionStorage.getItem('token');
            return this._token;
        }
        return null;
    }

    login(usuario: Usuario): Observable<any> {
        const urlEndpoint = '/api/login';
        const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
        return this.http.post<any>(urlEndpoint, JSON.stringify({ nombreUsuario: usuario.nombreUsuario, contrasenia: usuario.contrasenia }), headers);
    }

    guardar(usuarioDto: any): Observable<any> {
        const urlEndpoint = '/api/guardarUsuario';
        const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
        return this.http.post<any>(urlEndpoint, JSON.stringify(usuarioDto), headers);
    }

    guardarUsuario(accessToken: string): void {
        const payload = this.obtenerDatosToken(accessToken);
        this._usuario = new Usuario();
        this._usuario.nombre = payload.nombre;
        this._usuario.identificacion = payload.identificacion;
        this._usuario.edad = payload.edad;
        this._usuario.ciudad = payload.ciudad;
        this._usuario.roles = payload.authorities;
        sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    }

    guardarToken(accessToken: string): void {
        this._token = accessToken;
        sessionStorage.setItem('token', accessToken);
    }

    obtenerDatosToken(accessToken: string): any {
        if (accessToken != null) {
            return JSON.parse(atob(accessToken.split('.')[1]));
        }
        return null;
    }

    isAuthenticated(): boolean {
        const payload = this.obtenerDatosToken(this.token);
        if (payload != null && payload.user_name && payload.user_name.length > 0) {
            return true;
        }
        return false;
    }

    hasRole(role: string): boolean {
        if (this.usuario.roles.includes(role)) {
          return true;
        }
        return false;
      }
    
      logout(): void {
        this._token = null;
        this._usuario = null;
        sessionStorage.clear();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
      }

}
