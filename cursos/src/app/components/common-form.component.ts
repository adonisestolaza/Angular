import { Component, OnInit, Directive } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { CommonService } from '../services/common.service';
import { Generic } from '../models/generic';



@Directive()
export abstract class CommonFormComponent<E extends Generic, S extends CommonService<E> > implements OnInit {

  titulo!: string;

  model!: E;

  error: any;
  protected redirect!: string;
  protected nombreModel!: string;
  

  constructor(protected service: S,
              protected router: Router,
              protected route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params =>{
       const id: number = + params.get('id')!;

       if(id){

        this.service.ver(id).subscribe(model =>{

          this.model = model;
          this.titulo = 'Editar: ' + this.nombreModel;
        });
       }

    })

  }

  public crear(): void{

    this.service.crear(this.model).subscribe(m =>{

      console.log(m);
      swal.fire('Nuevo:', `${this.nombreModel} ${m.nombre} creado con Exito!`, 'success')
      this.router.navigate([this.redirect])
    }, err => {
      if(err.status === 400){
        this.error = err.error;

        console.log(this.error);
      }

    }
    );
  }

  public editar(): void{

    this.service.editar(this.model).subscribe(m =>{

      console.log(m);
      swal.fire('Modificado', `${this.nombreModel} ${m.nombre} Actualizado con exito!`, 'success')
      this.router.navigate([this.redirect])
    }, err => {
      if(err.status === 400){
        this.error = err.error;

        console.log(this.error);
      }

    }
    );
  }


}
