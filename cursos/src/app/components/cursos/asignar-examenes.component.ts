import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { ExamenService } from 'src/app/services/examen.service';
import { FormControl } from '@angular/forms';
import { Examen } from 'src/app/models/examen';

import {map, flatMap} from 'rxjs/operators'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.css']
})
export class AsignarExamenesComponent implements OnInit {


  curso: Curso;
  autoCompleteControl =  new FormControl();
  examenesFiltrados: Examen[] = [];

  examenAsignar: Examen[] = [];

  examenes: Examen[] = [];


  tabIndex=0;


  mostrarColumnas= ['nombre', 'asignatura', 'eliminar'];

  columnasExamen = ['id', 'nombre', 'asignatura','eliminar'];

  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;



  constructor(private  route: ActivatedRoute,
              private  cursoService: CursoService,
              private examenService: ExamenService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const  id  = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {

        this.curso=c;
        this.examenes = this.curso.examenes;
        this.iniciarPaginador();
      });

    });
    this.autoCompleteControl.valueChanges.pipe(
      map(valor => typeof valor === 'string'? valor: valor.nombre),
      flatMap(valor => valor? this.examenService.buscarPorNombre(valor): [])

    ).subscribe(examenes => this.examenesFiltrados = examenes);
  }


  mostrarNombre(examen? :  Examen):  string{

    return examen? examen.nombre: '';
  }

  iniciarPaginador(): void{
    this.dataSource = new MatTableDataSource<Examen>(this.examenes);
     this.dataSource.paginator= this.paginator;
     this.paginator._intl.itemsPerPageLabel  = "Registros por pagina";
     this.paginator._intl.firstPageLabel="Primera Pagina";
     this.paginator._intl.lastPageLabel="Ultima Pagina";
     this.paginator._intl.nextPageLabel="Pagina Siguiente";
     this.paginator._intl.previousPageLabel="Pagina Anterior";
}


  seleccionarExamen(event: MatAutocompleteSelectedEvent): void{
    const examen = event.option.value as Examen;

    if(!this.existe(examen.id)){
      this.examenAsignar = this.examenAsignar.concat(examen);
      console.log(this.examenAsignar);
      
    }else{
      Swal.fire('Error:',  `El examen  ${examen.nombre} ya esta  asignado`, 'error');
    }
    
      this.autoCompleteControl.setValue('');
      event.option.deselect();
      event.option.focus();

  }

  private existe(id: number):  boolean{

    let existe = false;

    this.examenAsignar.concat(this.examenes).forEach(e => {
      if(id === e.id){

        existe = true;
      }
    });
    return existe;
  }

  eliminarDelAsignar(examen: Examen): void{

    this.examenAsignar  =  this.examenAsignar.filter(

      e => examen.id != e.id
    );
  }

  asignar(): void{
    this.cursoService.asignarExamenes(this.curso, this.examenAsignar).subscribe(curso => {
      this.examenes = this.examenes.concat(this.examenAsignar);
      this.iniciarPaginador();
      this.examenAsignar = [];
      Swal.fire('Asignados: ', `Examenes asignados con exito al curso ${curso.nombre}`, 'success');
      this.tabIndex=2;
      console.log(this.examenAsignar);
    })
  }


  eliminarExamen(examen: Examen): void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas Seguro?',
      text: `¿Seguro que desea eliminar al:  ${examen.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.cursoService.eliminarExamen(this.curso, examen)
        .subscribe(curso =>{
          this.examenes = this.examenes.filter(e=> e.id !== examen.id);
          this.iniciarPaginador();
          Swal.fire('Eliminado:  ',`Examen ${examen.nombre} eliminado con exito del curso ${curso.nombre}`, 'success');

        });
  

      }
    })

   
  }

}
