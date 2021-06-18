import { Component, OnInit, ViewChild } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { ActivatedRoute, Router } from '@angular/router';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CursoService } from 'src/app/services/curso.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ResponderExamenModalComponent } from './responder-examen-modal.component';
import { RespuestaService } from 'src/app/services/respuesta.service';
import { Respuesta } from 'src/app/models/respuesta';
import Swal from 'sweetalert2';
import { VerExamenModalComponent } from './ver-examen-modal.component';

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {

  alumno: Alumno;
  curso: Curso;
  examenes: Examen[] = [];

  columnasExamen = ['id','nombre','asignaturas','preguntas','responder','ver'];

  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private route: ActivatedRoute,
              private  alumnoService: AlumnoService,
              private cursoService: CursoService,
              public dialog: MatDialog,
              private respuestaService: RespuestaService) { }

  ngOnInit(): void {  
    this.route.paramMap.subscribe(params =>{
      const id = +params.get('id');

      this.alumnoService.ver(id).subscribe(alumno => {

        this.alumno = alumno;
        this.cursoService.obtenerCursoPorAlumnoId(this.alumno).subscribe(curso =>{

          this.curso = curso;
          this.examenes = (curso && curso.examenes)? curso.examenes: [];

          this.iniciarPaginador();
          console.log(this.curso, this.alumno);
        });
      });
      
    })
    
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


  public responderExamen(examen: Examen):void{

   const modalRef =  this.dialog.open(ResponderExamenModalComponent, {
      width: '750px',
      data:{curso: this.curso, alumno: this.alumno, examen: examen
      }});

      modalRef.afterClosed().subscribe((respuestasMap: Map< number, Respuesta>) =>{
        console.log('Modal responder examen enviado  y cerrado');
        console.log(respuestasMap);
        if(respuestasMap){
          const respuestas: Respuesta[] = Array.from(respuestasMap.values());
          this.respuestaService.crear(respuestas).subscribe(rs =>{
            examen.respondido = true;
            Swal.fire('Enviadas',`Preguntas enviadas con  exito!`,'success');
            console.log(rs);
          });
        }
      });
  }

  verRespuestas(examen): void{

    this.respuestaService.obtenerRespuestasPorAlumnoPorExamen(this.alumno, examen).subscribe(rs =>{

      const modalRef =  this.dialog.open(VerExamenModalComponent, {
        width: '750px',
        data:{curso: this.curso, alumno: this.alumno, examen: examen, respuestas: rs
        }});

        modalRef.afterClosed().subscribe(() => {
          console.log('Modal Cerrado');
        });

    });
  }

}
