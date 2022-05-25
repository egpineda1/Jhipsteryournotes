import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NotaDetailComponent } from './nota-detail.component';

describe('Nota Management Detail Component', () => {
  let comp: NotaDetailComponent;
  let fixture: ComponentFixture<NotaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ nota: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NotaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NotaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load nota on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.nota).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
