import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDireccion } from '../direccion.model';
import { DireccionService } from '../service/direccion.service';
import { DireccionDeleteDialogComponent } from '../delete/direccion-delete-dialog.component';

@Component({
  selector: 'ynotes-direccion',
  templateUrl: './direccion.component.html',
})
export class DireccionComponent implements OnInit {
  direccions?: IDireccion[];
  isLoading = false;

  constructor(protected direccionService: DireccionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.direccionService.query().subscribe({
      next: (res: HttpResponse<IDireccion[]>) => {
        this.isLoading = false;
        this.direccions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDireccion): number {
    return item.id!;
  }

  delete(direccion: IDireccion): void {
    const modalRef = this.modalService.open(DireccionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.direccion = direccion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
