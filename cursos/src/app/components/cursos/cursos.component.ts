import { Component, OnInit } from '@angular/core';
import { CursoService } from 'src/app/services/curso.service';
import { Curso } from 'src/app/models/curso';
import { CommonListarComponent } from '../common-listar.component';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent 
extends CommonListarComponent<Curso, CursoService>  {

  constructor(service: CursoService) {

    super(service);
    this.nombreModelo = Curso.name;
    this.titulo = 'Listado de cursos';
  }


}
