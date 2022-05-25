import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAula } from '../aula.model';
import { AulaService } from '../service/aula.service';

@Component({
  templateUrl: './aula-delete-dialog.component.html',
})
export class AulaDeleteDialogComponent {
  aula?: IAula;

  constructor(protected aulaService: AulaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.aulaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
