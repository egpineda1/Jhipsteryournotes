import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReporteService } from '../service/reporte.service';
import { IReporte, Reporte } from '../reporte.model';
import { IAsignatura } from 'app/entities/asignatura/asignatura.model';
import { AsignaturaService } from 'app/entities/asignatura/service/asignatura.service';
import { IAula } from 'app/entities/aula/aula.model';
import { AulaService } from 'app/entities/aula/service/aula.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { ReporteUpdateComponent } from './reporte-update.component';

describe('Reporte Management Update Component', () => {
  let comp: ReporteUpdateComponent;
  let fixture: ComponentFixture<ReporteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reporteService: ReporteService;
  let asignaturaService: AsignaturaService;
  let aulaService: AulaService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReporteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ReporteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReporteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reporteService = TestBed.inject(ReporteService);
    asignaturaService = TestBed.inject(AsignaturaService);
    aulaService = TestBed.inject(AulaService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Asignatura query and add missing value', () => {
      const reporte: IReporte = { id: 456 };
      const asignaturas: IAsignatura[] = [{ id: 96570 }];
      reporte.asignaturas = asignaturas;

      const asignaturaCollection: IAsignatura[] = [{ id: 74997 }];
      jest.spyOn(asignaturaService, 'query').mockReturnValue(of(new HttpResponse({ body: asignaturaCollection })));
      const additionalAsignaturas = [...asignaturas];
      const expectedCollection: IAsignatura[] = [...additionalAsignaturas, ...asignaturaCollection];
      jest.spyOn(asignaturaService, 'addAsignaturaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reporte });
      comp.ngOnInit();

      expect(asignaturaService.query).toHaveBeenCalled();
      expect(asignaturaService.addAsignaturaToCollectionIfMissing).toHaveBeenCalledWith(asignaturaCollection, ...additionalAsignaturas);
      expect(comp.asignaturasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Aula query and add missing value', () => {
      const reporte: IReporte = { id: 456 };
      const aula: IAula = { id: 37453 };
      reporte.aula = aula;

      const aulaCollection: IAula[] = [{ id: 32411 }];
      jest.spyOn(aulaService, 'query').mockReturnValue(of(new HttpResponse({ body: aulaCollection })));
      const additionalAulas = [aula];
      const expectedCollection: IAula[] = [...additionalAulas, ...aulaCollection];
      jest.spyOn(aulaService, 'addAulaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reporte });
      comp.ngOnInit();

      expect(aulaService.query).toHaveBeenCalled();
      expect(aulaService.addAulaToCollectionIfMissing).toHaveBeenCalledWith(aulaCollection, ...additionalAulas);
      expect(comp.aulasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Usuario query and add missing value', () => {
      const reporte: IReporte = { id: 456 };
      const usuario: IUsuario = { id: 15970 };
      reporte.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 9760 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reporte });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(usuarioCollection, ...additionalUsuarios);
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reporte: IReporte = { id: 456 };
      const asignaturas: IAsignatura = { id: 6065 };
      reporte.asignaturas = [asignaturas];
      const aula: IAula = { id: 12740 };
      reporte.aula = aula;
      const usuario: IUsuario = { id: 83103 };
      reporte.usuario = usuario;

      activatedRoute.data = of({ reporte });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(reporte));
      expect(comp.asignaturasSharedCollection).toContain(asignaturas);
      expect(comp.aulasSharedCollection).toContain(aula);
      expect(comp.usuariosSharedCollection).toContain(usuario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reporte>>();
      const reporte = { id: 123 };
      jest.spyOn(reporteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reporte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reporte }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(reporteService.update).toHaveBeenCalledWith(reporte);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reporte>>();
      const reporte = new Reporte();
      jest.spyOn(reporteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reporte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reporte }));
      saveSubject.complete();

      // THEN
      expect(reporteService.create).toHaveBeenCalledWith(reporte);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reporte>>();
      const reporte = { id: 123 };
      jest.spyOn(reporteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reporte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reporteService.update).toHaveBeenCalledWith(reporte);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAsignaturaById', () => {
      it('Should return tracked Asignatura primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAsignaturaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAulaById', () => {
      it('Should return tracked Aula primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAulaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUsuarioById', () => {
      it('Should return tracked Usuario primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUsuarioById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedAsignatura', () => {
      it('Should return option if no Asignatura is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedAsignatura(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Asignatura for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedAsignatura(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Asignatura is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedAsignatura(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
