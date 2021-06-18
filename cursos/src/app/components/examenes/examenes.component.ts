import { Component, OnInit } from '@angular/core';
import { ExamenService } from 'src/app/services/examen.service';
import { CommonListarComponent } from '../common-listar.component';
import { Examen } from 'src/app/models/examen';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})
export class ExamenesComponent 
extends CommonListarComponent<Examen, ExamenService>  implements OnInit {
  

  constructor(service: ExamenService) {

    super(service);
    this.nombreModelo = Examen.name;
    this.titulo = 'Listado de examenes';
  }

}
