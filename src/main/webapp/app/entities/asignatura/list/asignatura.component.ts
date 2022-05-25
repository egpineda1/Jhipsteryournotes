import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAsignatura } from '../asignatura.model';
import { AsignaturaService } from '../service/asignatura.service';
import { AsignaturaDeleteDialogComponent } from '../delete/asignatura-delete-dialog.component';

@Component({
  selector: 'ynotes-asignatura',
  templateUrl: './asignatura.component.html',
})
export class AsignaturaComponent implements OnInit {
  asignaturas?: IAsignatura[];
  isLoading = false;

  constructor(protected asignaturaService: AsignaturaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.asignaturaService.query().subscribe({
      next: (res: HttpResponse<IAsignatura[]>) => {
        this.isLoading = false;
        this.asignaturas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAsignatura): number {
    return item.id!;
  }

  delete(asignatura: IAsignatura): void {
    const modalRef = this.modalService.open(AsignaturaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.asignatura = asignatura;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
