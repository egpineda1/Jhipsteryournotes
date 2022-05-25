import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IReporte } from '../reporte.model';
import { ReporteService } from '../service/reporte.service';
import { ReporteDeleteDialogComponent } from '../delete/reporte-delete-dialog.component';

@Component({
  selector: 'ynotes-reporte',
  templateUrl: './reporte.component.html',
})
export class ReporteComponent implements OnInit {
  reportes?: IReporte[];
  isLoading = false;

  constructor(protected reporteService: ReporteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.reporteService.query().subscribe({
      next: (res: HttpResponse<IReporte[]>) => {
        this.isLoading = false;
        this.reportes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IReporte): number {
    return item.id!;
  }

  delete(reporte: IReporte): void {
    const modalRef = this.modalService.open(ReporteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reporte = reporte;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
