import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INota } from '../nota.model';
import { NotaService } from '../service/nota.service';
import { NotaDeleteDialogComponent } from '../delete/nota-delete-dialog.component';

@Component({
  selector: 'ynotes-nota',
  templateUrl: './nota.component.html',
})
export class NotaComponent implements OnInit {
  notas?: INota[];
  isLoading = false;

  constructor(protected notaService: NotaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.notaService.query().subscribe({
      next: (res: HttpResponse<INota[]>) => {
        this.isLoading = false;
        this.notas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: INota): number {
    return item.id!;
  }

  delete(nota: INota): void {
    const modalRef = this.modalService.open(NotaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nota = nota;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
