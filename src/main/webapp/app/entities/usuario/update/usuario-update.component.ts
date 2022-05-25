import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUsuario, Usuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { IRol } from 'app/entities/rol/rol.model';
import { RolService } from 'app/entities/rol/service/rol.service';
import { IDireccion } from 'app/entities/direccion/direccion.model';
import { DireccionService } from 'app/entities/direccion/service/direccion.service';
import { ISede } from 'app/entities/sede/sede.model';
import { SedeService } from 'app/entities/sede/service/sede.service';

@Component({
  selector: 'ynotes-usuario-update',
  templateUrl: './usuario-update.component.html',
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;

  rolsSharedCollection: IRol[] = [];
  direccionsSharedCollection: IDireccion[] = [];
  sedesSharedCollection: ISede[] = [];

  editForm = this.fb.group({
    id: [],
    apellido: [null, [Validators.maxLength(50)]],
    codigo: [null, [Validators.maxLength(20)]],
    correo: [null, [Validators.maxLength(60)]],
    edad: [],
    genero: [null, [Validators.maxLength(1)]],
    identificacion: [null, [Validators.maxLength(12)]],
    nombre: [null, [Validators.maxLength(50)]],
    telefono: [null, [Validators.maxLength(12)]],
    rol: [],
    direccion: [],
    sede: [],
  });

  constructor(
    protected usuarioService: UsuarioService,
    protected rolService: RolService,
    protected direccionService: DireccionService,
    protected sedeService: SedeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.updateForm(usuario);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuario = this.createFromForm();
    if (usuario.id !== undefined) {
      this.subscribeToSaveResponse(this.usuarioService.update(usuario));
    } else {
      this.subscribeToSaveResponse(this.usuarioService.create(usuario));
    }
  }

  trackRolById(_index: number, item: IRol): number {
    return item.id!;
  }

  trackDireccionById(_index: number, item: IDireccion): number {
    return item.id!;
  }

  trackSedeById(_index: number, item: ISede): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuario>>): void {
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

  protected updateForm(usuario: IUsuario): void {
    this.editForm.patchValue({
      id: usuario.id,
      apellido: usuario.apellido,
      codigo: usuario.codigo,
      correo: usuario.correo,
      edad: usuario.edad,
      genero: usuario.genero,
      identificacion: usuario.identificacion,
      nombre: usuario.nombre,
      telefono: usuario.telefono,
      rol: usuario.rol,
      direccion: usuario.direccion,
      sede: usuario.sede,
    });

    this.rolsSharedCollection = this.rolService.addRolToCollectionIfMissing(this.rolsSharedCollection, usuario.rol);
    this.direccionsSharedCollection = this.direccionService.addDireccionToCollectionIfMissing(
      this.direccionsSharedCollection,
      usuario.direccion
    );
    this.sedesSharedCollection = this.sedeService.addSedeToCollectionIfMissing(this.sedesSharedCollection, usuario.sede);
  }

  protected loadRelationshipsOptions(): void {
    this.rolService
      .query()
      .pipe(map((res: HttpResponse<IRol[]>) => res.body ?? []))
      .pipe(map((rols: IRol[]) => this.rolService.addRolToCollectionIfMissing(rols, this.editForm.get('rol')!.value)))
      .subscribe((rols: IRol[]) => (this.rolsSharedCollection = rols));

    this.direccionService
      .query()
      .pipe(map((res: HttpResponse<IDireccion[]>) => res.body ?? []))
      .pipe(
        map((direccions: IDireccion[]) =>
          this.direccionService.addDireccionToCollectionIfMissing(direccions, this.editForm.get('direccion')!.value)
        )
      )
      .subscribe((direccions: IDireccion[]) => (this.direccionsSharedCollection = direccions));

    this.sedeService
      .query()
      .pipe(map((res: HttpResponse<ISede[]>) => res.body ?? []))
      .pipe(map((sedes: ISede[]) => this.sedeService.addSedeToCollectionIfMissing(sedes, this.editForm.get('sede')!.value)))
      .subscribe((sedes: ISede[]) => (this.sedesSharedCollection = sedes));
  }

  protected createFromForm(): IUsuario {
    return {
      ...new Usuario(),
      id: this.editForm.get(['id'])!.value,
      apellido: this.editForm.get(['apellido'])!.value,
      codigo: this.editForm.get(['codigo'])!.value,
      correo: this.editForm.get(['correo'])!.value,
      edad: this.editForm.get(['edad'])!.value,
      genero: this.editForm.get(['genero'])!.value,
      identificacion: this.editForm.get(['identificacion'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      telefono: this.editForm.get(['telefono'])!.value,
      rol: this.editForm.get(['rol'])!.value,
      direccion: this.editForm.get(['direccion'])!.value,
      sede: this.editForm.get(['sede'])!.value,
    };
  }
}
