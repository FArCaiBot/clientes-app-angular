import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  constructor(private clienteService: ClienteService) {}
  ngOnInit(): void {
    this.clienteService
      .getClientes()
      .subscribe((clientes) => (this.clientes = clientes));
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: `Seguro que desea eliminar el cliente ${cliente.nombre} ?`,
      text: 'Le recordamos que esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe((response) => {
          this.clientes = this.clientes?.filter((el) => el.id !== cliente.id);
          Swal.fire(
            'Cliente Eliminado!',
            `Cliente ${cliente.nombre} eliminado con éxito.`,
            'success'
          );
        });
      }
    });
  }
}
