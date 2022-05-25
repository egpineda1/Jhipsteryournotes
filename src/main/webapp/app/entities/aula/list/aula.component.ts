import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAula } from '../aula.model';
import { AulaService } from '../service/aula.service';
import { AulaDeleteDialogComponent } from '../delete/aula-delete-dialog.component';

@Component({
  selector: 'ynotes-aula',
  templateUrl: './aula.component.html',
})
export class AulaComponent implements OnInit {
  aulas?: IAula[];
  isLoading = false;

  constructor(protected aulaService: AulaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.aulaService.query().subscribe({
      next: (res: HttpResponse<IAula[]>) => {
        this.isLoading = false;
        this.aulas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAula): number {
    return item.id!;
  }

  delete(aula: IAula): void {
    const modalRef = this.modalService.open(AulaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.aula = aula;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
