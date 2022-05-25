import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISede } from '../sede.model';

@Component({
  selector: 'ynotes-sede-detail',
  templateUrl: './sede-detail.component.html',
})
export class SedeDetailComponent implements OnInit {
  sede: ISede | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sede }) => {
      this.sede = sede;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
