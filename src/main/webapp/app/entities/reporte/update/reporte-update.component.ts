import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IReporte, Reporte } from '../reporte.model';
import { ReporteService } from '../service/reporte.service';
import { IAsignatura } from 'app/entities/asignatura/asignatura.model';
import { AsignaturaService } from 'app/entities/asignatura/service/asignatura.service';
import { IAula } from 'app/entities/aula/aula.model';
import { AulaService } from 'app/entities/aula/service/aula.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'ynotes-reporte-update',
  templateUrl: './reporte-update.component.html',
})
export class ReporteUpdateComponent implements OnInit {
  isSaving = false;

  asignaturasSharedCollection: IAsignatura[] = [];
  aulasSharedCollection: IAula[] = [];
  usuariosSharedCollection: IUsuario[] = [];

  editForm = this.fb.group({
    id: [],
    alerta: [null, [Validators.maxLength(30)]],
    promedioFinal: [],
    promedioParcial: [],
    asignaturas: [],
    aula: [],
    usuario: [],
  });

  constructor(
    protected reporteService: ReporteService,
    protected asignaturaService: AsignaturaService,
    protected aulaService: AulaService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reporte }) => {
      this.updateForm(reporte);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reporte = this.createFromForm();
    if (reporte.id !== undefined) {
      this.subscribeToSaveResponse(this.reporteService.update(reporte));
    } else {
      this.subscribeToSaveResponse(this.reporteService.create(reporte));
    }
  }

  trackAsignaturaById(_index: number, item: IAsignatura): number {
    return item.id!;
  }

  trackAulaById(_index: number, item: IAula): number {
    return item.id!;
  }

  trackUsuarioById(_index: number, item: IUsuario): number {
    return item.id!;
  }

  getSelectedAsignatura(option: IAsignatura, selectedVals?: IAsignatura[]): IAsignatura {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReporte>>): void {
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

  protected updateForm(reporte: IReporte): void {
    this.editForm.patchValue({
      id: reporte.id,
      alerta: reporte.alerta,
      promedioFinal: reporte.promedioFinal,
      promedioParcial: reporte.promedioParcial,
      asignaturas: reporte.asignaturas,
      aula: reporte.aula,
      usuario: reporte.usuario,
    });

    this.asignaturasSharedCollection = this.asignaturaService.addAsignaturaToCollectionIfMissing(
      this.asignaturasSharedCollection,
      ...(reporte.asignaturas ?? [])
    );
    this.aulasSharedCollection = this.aulaService.addAulaToCollectionIfMissing(this.aulasSharedCollection, reporte.aula);
    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing(this.usuariosSharedCollection, reporte.usuario);
  }

  protected loadRelationshipsOptions(): void {
    this.asignaturaService
      .query()
      .pipe(map((res: HttpResponse<IAsignatura[]>) => res.body ?? []))
      .pipe(
        map((asignaturas: IAsignatura[]) =>
          this.asignaturaService.addAsignaturaToCollectionIfMissing(asignaturas, ...(this.editForm.get('asignaturas')!.value ?? []))
        )
      )
      .subscribe((asignaturas: IAsignatura[]) => (this.asignaturasSharedCollection = asignaturas));

    this.aulaService
      .query()
      .pipe(map((res: HttpResponse<IAula[]>) => res.body ?? []))
      .pipe(map((aulas: IAula[]) => this.aulaService.addAulaToCollectionIfMissing(aulas, this.editForm.get('aula')!.value)))
      .subscribe((aulas: IAula[]) => (this.aulasSharedCollection = aulas));

    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing(usuarios, this.editForm.get('usuario')!.value))
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }

  protected createFromForm(): IReporte {
    return {
      ...new Reporte(),
      id: this.editForm.get(['id'])!.value,
      alerta: this.editForm.get(['alerta'])!.value,
      promedioFinal: this.editForm.get(['promedioFinal'])!.value,
      promedioParcial: this.editForm.get(['promedioParcial'])!.value,
      asignaturas: this.editForm.get(['asignaturas'])!.value,
      aula: this.editForm.get(['aula'])!.value,
      usuario: this.editForm.get(['usuario'])!.value,
    };
  }
}
