import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAula, Aula } from '../aula.model';
import { AulaService } from '../service/aula.service';

@Component({
  selector: 'ynotes-aula-update',
  templateUrl: './aula-update.component.html',
})
export class AulaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    capacidadMaxima: [],
    grado: [],
    salon: [null, [Validators.maxLength(20)]],
  });

  constructor(protected aulaService: AulaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aula }) => {
      this.updateForm(aula);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const aula = this.createFromForm();
    if (aula.id !== undefined) {
      this.subscribeToSaveResponse(this.aulaService.update(aula));
    } else {
      this.subscribeToSaveResponse(this.aulaService.create(aula));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAula>>): void {
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

  protected updateForm(aula: IAula): void {
    this.editForm.patchValue({
      id: aula.id,
      capacidadMaxima: aula.capacidadMaxima,
      grado: aula.grado,
      salon: aula.salon,
    });
  }

  protected createFromForm(): IAula {
    return {
      ...new Aula(),
      id: this.editForm.get(['id'])!.value,
      capacidadMaxima: this.editForm.get(['capacidadMaxima'])!.value,
      grado: this.editForm.get(['grado'])!.value,
      salon: this.editForm.get(['salon'])!.value,
    };
  }
}
