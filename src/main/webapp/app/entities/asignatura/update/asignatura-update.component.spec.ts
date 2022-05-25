import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AsignaturaService } from '../service/asignatura.service';
import { IAsignatura, Asignatura } from '../asignatura.model';
import { INota } from 'app/entities/nota/nota.model';
import { NotaService } from 'app/entities/nota/service/nota.service';

import { AsignaturaUpdateComponent } from './asignatura-update.component';

describe('Asignatura Management Update Component', () => {
  let comp: AsignaturaUpdateComponent;
  let fixture: ComponentFixture<AsignaturaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let asignaturaService: AsignaturaService;
  let notaService: NotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AsignaturaUpdateComponent],
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
      .overrideTemplate(AsignaturaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AsignaturaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    asignaturaService = TestBed.inject(AsignaturaService);
    notaService = TestBed.inject(NotaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call nota query and add missing value', () => {
      const asignatura: IAsignatura = { id: 456 };
      const nota: INota = { id: 57525 };
      asignatura.nota = nota;

      const notaCollection: INota[] = [{ id: 12215 }];
      jest.spyOn(notaService, 'query').mockReturnValue(of(new HttpResponse({ body: notaCollection })));
      const expectedCollection: INota[] = [nota, ...notaCollection];
      jest.spyOn(notaService, 'addNotaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ asignatura });
      comp.ngOnInit();

      expect(notaService.query).toHaveBeenCalled();
      expect(notaService.addNotaToCollectionIfMissing).toHaveBeenCalledWith(notaCollection, nota);
      expect(comp.notasCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const asignatura: IAsignatura = { id: 456 };
      const nota: INota = { id: 61831 };
      asignatura.nota = nota;

      activatedRoute.data = of({ asignatura });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(asignatura));
      expect(comp.notasCollection).toContain(nota);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asignatura>>();
      const asignatura = { id: 123 };
      jest.spyOn(asignaturaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asignatura });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asignatura }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(asignaturaService.update).toHaveBeenCalledWith(asignatura);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asignatura>>();
      const asignatura = new Asignatura();
      jest.spyOn(asignaturaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asignatura });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asignatura }));
      saveSubject.complete();

      // THEN
      expect(asignaturaService.create).toHaveBeenCalledWith(asignatura);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asignatura>>();
      const asignatura = { id: 123 };
      jest.spyOn(asignaturaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asignatura });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(asignaturaService.update).toHaveBeenCalledWith(asignatura);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackNotaById', () => {
      it('Should return tracked Nota primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNotaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
