import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAula } from '../aula.model';

@Component({
  selector: 'ynotes-aula-detail',
  templateUrl: './aula-detail.component.html',
})
export class AulaDetailComponent implements OnInit {
  aula: IAula | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aula }) => {
      this.aula = aula;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
