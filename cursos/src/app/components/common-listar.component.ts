import { OnInit, ViewChild, Directive } from '@angular/core';
import swal from 'sweetalert2';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

@Directive()
export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E> > implements OnInit {

  titulo!: string;

  lista: E[] = [];
  protected nombreModelo!: string; 

  totalRegistro: number = 0;
  paginaActual: number = 0;
  totalPorPaginas: number =  5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(protected service: S) { }

  ngOnInit(): void {
    this.calcularRangos();
  }

  public pagina(event: PageEvent): void{
    this.paginaActual = event.pageIndex;
    this.totalPorPaginas = event.pageSize;
    this.calcularRangos();
  }

  private calcularRangos(){

    this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPaginas.toString())
    .subscribe(p => {

      this.lista = p.content as E[];
      this.totalRegistro = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros por pagina';
      this.paginator._intl.nextPageLabel = 'Pagina Siguiente';
      this.paginator._intl.firstPageLabel = 'Primera pagina';
      this.paginator._intl.previousPageLabel = 'Pagina anterior';
      this.paginator._intl.lastPageLabel = 'Ultima pagina';
      
    })
  }

  public eliminar(e: E): void {

    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas Seguro?',
      text: `¿Seguro que desea eliminar al ${this.nombreModelo} ${e.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.service.eliminar(e.id).subscribe(() => {
          this.calcularRangos();
          swalWithBootstrapButtons.fire(
            `${this.nombreModelo} Eliminado`,
            `${this.nombreModelo}  ${e.nombre} eliminado con éxito.`,
            'success'
          )
        });

      }
    })

  }

}
