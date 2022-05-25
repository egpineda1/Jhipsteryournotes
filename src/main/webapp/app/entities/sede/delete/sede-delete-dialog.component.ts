import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISede } from '../sede.model';
import { SedeService } from '../service/sede.service';

@Component({
  templateUrl: './sede-delete-dialog.component.html',
})
export class SedeDeleteDialogComponent {
  sede?: ISede;

  constructor(protected sedeService: SedeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sedeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
