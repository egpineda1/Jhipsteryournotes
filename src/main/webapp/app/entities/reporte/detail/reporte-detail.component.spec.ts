import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReporteDetailComponent } from './reporte-detail.component';

describe('Reporte Management Detail Component', () => {
  let comp: ReporteDetailComponent;
  let fixture: ComponentFixture<ReporteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ reporte: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ReporteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReporteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load reporte on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.reporte).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
