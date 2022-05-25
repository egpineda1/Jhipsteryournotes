import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISede } from '../sede.model';
import { SedeService } from '../service/sede.service';
import { SedeDeleteDialogComponent } from '../delete/sede-delete-dialog.component';

@Component({
  selector: 'ynotes-sede',
  templateUrl: './sede.component.html',
})
export class SedeComponent implements OnInit {
  sedes?: ISede[];
  isLoading = false;

  constructor(protected sedeService: SedeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sedeService.query().subscribe({
      next: (res: HttpResponse<ISede[]>) => {
        this.isLoading = false;
        this.sedes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISede): number {
    return item.id!;
  }

  delete(sede: ISede): void {
    const modalRef = this.modalService.open(SedeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sede = sede;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
