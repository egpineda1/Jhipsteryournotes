import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAsignatura } from '../asignatura.model';
import { AsignaturaService } from '../service/asignatura.service';

@Component({
  templateUrl: './asignatura-delete-dialog.component.html',
})
export class AsignaturaDeleteDialogComponent {
  asignatura?: IAsignatura;

  constructor(protected asignaturaService: AsignaturaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.asignaturaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
