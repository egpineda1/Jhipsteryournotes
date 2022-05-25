import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AulaDetailComponent } from './aula-detail.component';

describe('Aula Management Detail Component', () => {
  let comp: AulaDetailComponent;
  let fixture: ComponentFixture<AulaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AulaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ aula: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AulaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AulaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load aula on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.aula).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
