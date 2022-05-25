import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SedeService } from '../service/sede.service';
import { ISede, Sede } from '../sede.model';

import { SedeUpdateComponent } from './sede-update.component';

describe('Sede Management Update Component', () => {
  let comp: SedeUpdateComponent;
  let fixture: ComponentFixture<SedeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sedeService: SedeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SedeUpdateComponent],
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
      .overrideTemplate(SedeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SedeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sedeService = TestBed.inject(SedeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sede: ISede = { id: 456 };

      activatedRoute.data = of({ sede });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sede));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sede>>();
      const sede = { id: 123 };
      jest.spyOn(sedeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sede });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sede }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sedeService.update).toHaveBeenCalledWith(sede);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sede>>();
      const sede = new Sede();
      jest.spyOn(sedeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sede });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sede }));
      saveSubject.complete();

      // THEN
      expect(sedeService.create).toHaveBeenCalledWith(sede);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sede>>();
      const sede = { id: 123 };
      jest.spyOn(sedeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sede });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sedeService.update).toHaveBeenCalledWith(sede);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
