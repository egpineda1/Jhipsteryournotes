import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAsignatura } from '../asignatura.model';

@Component({
  selector: 'ynotes-asignatura-detail',
  templateUrl: './asignatura-detail.component.html',
})
export class AsignaturaDetailComponent implements OnInit {
  asignatura: IAsignatura | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ asignatura }) => {
      this.asignatura = asignatura;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
