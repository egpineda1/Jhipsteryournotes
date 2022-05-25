import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SedeDetailComponent } from './sede-detail.component';

describe('Sede Management Detail Component', () => {
  let comp: SedeDetailComponent;
  let fixture: ComponentFixture<SedeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SedeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sede: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SedeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SedeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sede on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sede).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
