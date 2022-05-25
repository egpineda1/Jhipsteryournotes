import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISede, Sede } from '../sede.model';
import { SedeService } from '../service/sede.service';

@Component({
  selector: 'ynotes-sede-update',
  templateUrl: './sede-update.component.html',
})
export class SedeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    correoSede: [null, [Validators.maxLength(80)]],
    direccioSede: [null, [Validators.maxLength(50)]],
    nombreSede: [null, [Validators.maxLength(30)]],
    telefonoSede: [null, [Validators.maxLength(20)]],
  });

  constructor(protected sedeService: SedeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sede }) => {
      this.updateForm(sede);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sede = this.createFromForm();
    if (sede.id !== undefined) {
      this.subscribeToSaveResponse(this.sedeService.update(sede));
    } else {
      this.subscribeToSaveResponse(this.sedeService.create(sede));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISede>>): void {
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

  protected updateForm(sede: ISede): void {
    this.editForm.patchValue({
      id: sede.id,
      correoSede: sede.correoSede,
      direccioSede: sede.direccioSede,
      nombreSede: sede.nombreSede,
      telefonoSede: sede.telefonoSede,
    });
  }

  protected createFromForm(): ISede {
    return {
      ...new Sede(),
      id: this.editForm.get(['id'])!.value,
      correoSede: this.editForm.get(['correoSede'])!.value,
      direccioSede: this.editForm.get(['direccioSede'])!.value,
      nombreSede: this.editForm.get(['nombreSede'])!.value,
      telefonoSede: this.editForm.get(['telefonoSede'])!.value,
    };
  }
}
