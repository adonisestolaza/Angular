import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Examen } from '../models/examen';
import { CommonService } from './common.service';
import { BASE_ENDPOINT } from '../config/app';
import { Observable } from 'rxjs';
import { Asignatura } from '../models/asignatura';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends CommonService<Examen>{

 protected baseEndpoint = BASE_ENDPOINT +'/examenes';

  constructor(http: HttpClient) {
    super(http);
   }
   public findAllAsignatura(): Observable<Asignatura[]>{

      return this.http.get<Asignatura[]>(`${this.baseEndpoint}/asignaturas`);
   }

   public buscarPorNombre(nombre: string): Observable<Examen[]>{

    return this.http.get<Examen[]>(`${this.baseEndpoint}/buscar/${nombre}`);
   }
  
  
  }
