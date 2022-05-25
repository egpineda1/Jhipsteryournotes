import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AulaService } from '../service/aula.service';
import { IAula, Aula } from '../aula.model';

import { AulaUpdateComponent } from './aula-update.component';

describe('Aula Management Update Component', () => {
  let comp: AulaUpdateComponent;
  let fixture: ComponentFixture<AulaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let aulaService: AulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AulaUpdateComponent],
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
      .overrideTemplate(AulaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AulaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    aulaService = TestBed.inject(AulaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const aula: IAula = { id: 456 };

      activatedRoute.data = of({ aula });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(aula));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Aula>>();
      const aula = { id: 123 };
      jest.spyOn(aulaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: aula }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(aulaService.update).toHaveBeenCalledWith(aula);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Aula>>();
      const aula = new Aula();
      jest.spyOn(aulaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: aula }));
      saveSubject.complete();

      // THEN
      expect(aulaService.create).toHaveBeenCalledWith(aula);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Aula>>();
      const aula = { id: 123 };
      jest.spyOn(aulaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(aulaService.update).toHaveBeenCalledWith(aula);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
