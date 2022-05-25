import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReporte } from '../reporte.model';

@Component({
  selector: 'ynotes-reporte-detail',
  templateUrl: './reporte-detail.component.html',
})
export class ReporteDetailComponent implements OnInit {
  reporte: IReporte | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reporte }) => {
      this.reporte = reporte;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
