import { Component, OnInit, Inject } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { Alumno } from 'src/app/models/alumno';
import { Examen } from 'src/app/models/examen';
import { Respuesta } from 'src/app/models/respuesta';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-examen-modal',
  templateUrl: './ver-examen-modal.component.html',
  styleUrls: ['./ver-examen-modal.component.css']
})
export class VerExamenModalComponent implements OnInit {


  curso: Curso;
  alumno: Alumno; 
  examen: Examen;
  respuestas:  Respuesta[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public modalRef: MatDialogRef<VerExamenModalComponent>) { }

  ngOnInit(): void {

    this.curso = this.data.curso as Curso;
    this.alumno = this.data.alumno as Alumno;
    this.examen = this.data.examen  as Examen;
    this.respuestas = this.data.respuestas as Respuesta[];
  }

  cancelar(): void{
    this.modalRef.close();
  }


}
