import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INota } from '../nota.model';
import { NotaService } from '../service/nota.service';

@Component({
  templateUrl: './nota-delete-dialog.component.html',
})
export class NotaDeleteDialogComponent {
  nota?: INota;

  constructor(protected notaService: NotaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.notaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
