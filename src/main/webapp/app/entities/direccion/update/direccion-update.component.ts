import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDireccion, Direccion } from '../direccion.model';
import { DireccionService } from '../service/direccion.service';

@Component({
  selector: 'ynotes-direccion-update',
  templateUrl: './direccion-update.component.html',
})
export class DireccionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    barrio: [null, [Validators.maxLength(30)]],
    ciudad: [null, [Validators.maxLength(30)]],
    departamento: [null, [Validators.maxLength(25)]],
    numeracion: [null, [Validators.maxLength(50)]],
  });

  constructor(protected direccionService: DireccionService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ direccion }) => {
      this.updateForm(direccion);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const direccion = this.createFromForm();
    if (direccion.id !== undefined) {
      this.subscribeToSaveResponse(this.direccionService.update(direccion));
    } else {
      this.subscribeToSaveResponse(this.direccionService.create(direccion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDireccion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(direccion: IDireccion): void {
    this.editForm.patchValue({
      id: direccion.id,
      barrio: direccion.barrio,
      ciudad: direccion.ciudad,
      departamento: direccion.departamento,
      numeracion: direccion.numeracion,
    });
  }

  protected createFromForm(): IDireccion {
    return {
      ...new Direccion(),
      id: this.editForm.get(['id'])!.value,
      barrio: this.editForm.get(['barrio'])!.value,
      ciudad: this.editForm.get(['ciudad'])!.value,
      departamento: this.editForm.get(['departamento'])!.value,
      numeracion: this.editForm.get(['numeracion'])!.value,
    };
  }
}
