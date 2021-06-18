import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Alumno } from 'src/app/models/alumno';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css']
})
export class AsignarAlumnosComponent implements OnInit {

  curso: Curso;
  alumnoAsignar: Alumno[] = [];
  alumnos: Alumno[] = [];

  dataSource: MatTableDataSource<Alumno>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;



  tabIndex=0;

  mostrarColumnas: string[]= ['nombre', 'apellido', 'seleccion'];

  columnasAlumnos: string[]= ['id','nombre', 'apellido', 'email','eliminar'];
  
  seleccion: SelectionModel<Alumno> = new SelectionModel<Alumno>(true, []);

  
  constructor(private route: ActivatedRoute, 
    private  cursoService: CursoService,
    private alumnoService: AlumnoService) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params =>{
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {
        this.curso = c;
        this.alumnos = this.curso.alumnos;
        

        this.iniciarPaginador();

      } );

    });

  }


  iniciarPaginador(): void{
       this.dataSource = new MatTableDataSource<Alumno>(this.alumnos);
        this.dataSource.paginator= this.paginator;
        this.paginator._intl.itemsPerPageLabel  = "Registros por pagina";
        this.paginator._intl.firstPageLabel="Primera Pagina";
        this.paginator._intl.lastPageLabel="Ultima Pagina";
        this.paginator._intl.nextPageLabel="Pagina Siguiente";
        this.paginator._intl.previousPageLabel="Pagina Anterior";
  }

  buscar(nombre: string): void{
    nombre = nombre != undefined? nombre.trim(): '';
    if(nombre!=''){
      this.alumnoService.buscarPorNombre(nombre)
      .subscribe(alumnos =>
        this.alumnoAsignar = alumnos.filter(a => { 
          let filtrar = true;
          this.alumnos.forEach(ca =>{
            if(a.id === ca.id){
              filtrar = false;
            }
          });
          return filtrar;
        }));

    }
   
  }

  estanTodosSeleccionados(): boolean{
    const seleccionados = this.seleccion.selected.length;
    const numAlumnos = this.alumnoAsignar.length;
    return (seleccionados === numAlumnos);
  }

  seleccionarDesSelecionarTodo(): void{
    this.estanTodosSeleccionados()?
    this.seleccion.clear():
    this.alumnoAsignar.forEach(a => this.seleccion.select(a));
  }


  asignar(): void{

    console.log(this.seleccion.selected);
    this.cursoService.asignarAlumnos(this.curso,this.seleccion.selected)
    .subscribe(c => {
      this.tabIndex=2;
      Swal.fire('Asignados: ',`Alumnos asignados con exito al curso ${this.curso.nombre}`,'success');
      this.alumnos = this.alumnos.concat(this.seleccion.selected);
      this.iniciarPaginador();
      this.alumnoAsignar = [];
      this.seleccion.clear();
    }, 
    e =>{
      if(e.status === 500){
        const mensaje = e.error.message as string;
        if(mensaje.indexOf('ConstraintViolationException') > -1){
          Swal.fire('Cuidado: ', 'El alumno esta asignado en otro curso','error');

        }

      }

    }

    );

  }

  eliminarAlumno(alumno: Alumno): void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas Seguro?',
      text: `¿Seguro que desea eliminar al:  ${alumno.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.cursoService.eliminarAlumno(this.curso, alumno)
        .subscribe(curso =>{
    
          this.alumnos = this.alumnos.filter(a => a.id != alumno.id);
          this.iniciarPaginador();
          Swal.fire('Eliminado:  ',`Alumno ${alumno.nombre} eliminado con exito del curso ${curso.nombre}`, 'success');

        });
  

      }
    })

   
  }
  

  
  
}
