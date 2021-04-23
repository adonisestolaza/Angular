import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
})
export class DirectivaComponent{

  constructor() { }

  listaCurso: string[] = ['TypeScript', 'Spring','Java SE', 'C#', 'PHP', 'JavaScript' ];

  habilitar: boolean = true;

  setHabilitar(): void {
    this.habilitar = (this.habilitar == true)? false : true;
  }


}
