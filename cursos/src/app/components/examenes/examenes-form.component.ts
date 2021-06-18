import { Component, OnInit } from '@angular/core';
import { CommonFormComponent } from '../common-form.component';
import { Examen } from 'src/app/models/examen';
import { ExamenService } from 'src/app/services/examen.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Asignatura } from 'src/app/models/asignatura';
import { Pregunta } from 'src/app/models/pregunta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-examenes-form',
  templateUrl: './examenes-form.component.html',
  styleUrls: ['./examenes-form.component.css']
})
export class ExamenesFormComponent
  extends CommonFormComponent<Examen, ExamenService> implements OnInit {

  asignaturasPadre: Asignatura[] = [];
  asignaturasHija: Asignatura[] = [];

  constructor(service: ExamenService,
    router: Router,
    route: ActivatedRoute) {
    super(service, router, route);
    this.titulo = 'Crear Examen';
    this.model = new Examen();
    this.redirect = '/examenes';
    this.nombreModel = Examen.name;
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id: number = + params.get('id')!;

      if (id) {

        this.service.ver(id).subscribe(model => {

          this.model = model;
          this.titulo = 'Editar: ' + this.nombreModel;

          this.cargarHijos();

        });
      }

    });

    this.service.findAllAsignatura()
      .subscribe(asignaturas => this.asignaturasPadre = asignaturas.filter(a => !a.padre));
  }

  public crear(): void {

    if(this.model.preguntas.length === 0){
      Swal.fire('Error Preguntas', 'Examen debe tener preguntas', 'error');
      return;
    }

    this.eliminarPreguntasVacias();
    super.crear();

  }


  public editar(): void {
    if(this.model.preguntas.length === 0){
      Swal.fire('Error Preguntas', 'Examen debe tener preguntas', 'error');
      return;
    }

    this.eliminarPreguntasVacias();
    super.editar();

  }

  public cargarHijos(): void {
    this.asignaturasHija = this.asignaturasPadre ? this.model.asignaturaPadre.hijos : [];
  }


  compararAsignatura(a1: Asignatura, a2: Asignatura): boolean {
    if (a1 === undefined && a2 === undefined) {
      return true;
    }

    return (a1 === null || a2 === null || a1 === undefined || a2 === undefined)
      ? false : a1.id === a2.id;
  }

  agregarPregunta(): void {

    this.model.preguntas.push(new Pregunta());
  }

  asignarTexto(pregunta: Pregunta, event: any): void {

    pregunta.texto = event.target.value as string;

    console.log(this.model);

  }

  eliminarPregunta(pregunta): void {

    this.model.preguntas = this.model.preguntas.filter(p => pregunta.texto !== p.texto);
  }

  eliminarPreguntasVacias(): void {

    this.model.preguntas = this.model.preguntas.filter(p => p.texto != null && p.texto.length > 0);
  }



}
