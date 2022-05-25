import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAsignatura, Asignatura } from '../asignatura.model';
import { AsignaturaService } from '../service/asignatura.service';
import { INota } from 'app/entities/nota/nota.model';
import { NotaService } from 'app/entities/nota/service/nota.service';

@Component({
  selector: 'ynotes-asignatura-update',
  templateUrl: './asignatura-update.component.html',
})
export class AsignaturaUpdateComponent implements OnInit {
  isSaving = false;

  notasCollection: INota[] = [];

  editForm = this.fb.group({
    id: [],
    codeAsignatura: [],
    asignatura: [null, [Validators.maxLength(40)]],
    nota: [],
  });

  constructor(
    protected asignaturaService: AsignaturaService,
    protected notaService: NotaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ asignatura }) => {
      this.updateForm(asignatura);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const asignatura = this.createFromForm();
    if (asignatura.id !== undefined) {
      this.subscribeToSaveResponse(this.asignaturaService.update(asignatura));
    } else {
      this.subscribeToSaveResponse(this.asignaturaService.create(asignatura));
    }
  }

  trackNotaById(_index: number, item: INota): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAsignatura>>): void {
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

  protected updateForm(asignatura: IAsignatura): void {
    this.editForm.patchValue({
      id: asignatura.id,
      codeAsignatura: asignatura.codeAsignatura,
      asignatura: asignatura.asignatura,
      nota: asignatura.nota,
    });

    this.notasCollection = this.notaService.addNotaToCollectionIfMissing(this.notasCollection, asignatura.nota);
  }

  protected loadRelationshipsOptions(): void {
    this.notaService
      .query({ filter: 'asignatura-is-null' })
      .pipe(map((res: HttpResponse<INota[]>) => res.body ?? []))
      .pipe(map((notas: INota[]) => this.notaService.addNotaToCollectionIfMissing(notas, this.editForm.get('nota')!.value)))
      .subscribe((notas: INota[]) => (this.notasCollection = notas));
  }

  protected createFromForm(): IAsignatura {
    return {
      ...new Asignatura(),
      id: this.editForm.get(['id'])!.value,
      codeAsignatura: this.editForm.get(['codeAsignatura'])!.value,
      asignatura: this.editForm.get(['asignatura'])!.value,
      nota: this.editForm.get(['nota'])!.value,
    };
  }
}
