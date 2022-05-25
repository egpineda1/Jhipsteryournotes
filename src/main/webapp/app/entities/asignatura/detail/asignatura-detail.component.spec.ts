import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AsignaturaDetailComponent } from './asignatura-detail.component';

describe('Asignatura Management Detail Component', () => {
  let comp: AsignaturaDetailComponent;
  let fixture: ComponentFixture<AsignaturaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignaturaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ asignatura: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AsignaturaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AsignaturaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load asignatura on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.asignatura).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
