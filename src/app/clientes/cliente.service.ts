import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/cliente';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient, private router: Router) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint).pipe(
      tap((response) => {
        let clientes = response as Cliente[];
        console.log('ClienteService: tap 1');
        clientes.forEach((cliente) => console.log(cliente.nombre));
      }),
      map((response) => {
        let clientes = response as Cliente[];
        return clientes.map((cliente) => {
          cliente.nombre = cliente.nombre?.toUpperCase();

          /* cliente.createAt = formatDate(
            cliente.createAt ? cliente.createAt : '',
            'EEEE dd, MMMM yyyy',
            'es'
          ); */
          return cliente;
        });
      }),
      tap((response) => {
        console.log('ClienteService: tap 2');
        response.forEach((cliente) => {
          console.log(cliente.nombre);
        });
      })
    );
    //return of(CLIENTES);
  }
  getCliente(id: Number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        this.router.navigate(['/clientes']);
        console.log(e);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndPoint, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError((e) => {
          if (e.status === 400) {
            return throwError(() => e);
          }
          console.log(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(() => e);
        })
      );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status === 400) {
            return throwError(() => e);
          }
          console.log(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(() => e);
        })
      );
  }

  delete(id: number = 0): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          Swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error');
          return throwError(() => e);
        })
      );
  }
}
