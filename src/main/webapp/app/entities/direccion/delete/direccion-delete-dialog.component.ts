import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDireccion } from '../direccion.model';
import { DireccionService } from '../service/direccion.service';

@Component({
  templateUrl: './direccion-delete-dialog.component.html',
})
export class DireccionDeleteDialogComponent {
  direccion?: IDireccion;

  constructor(protected direccionService: DireccionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.direccionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
