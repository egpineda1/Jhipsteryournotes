import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NotaService } from '../service/nota.service';

import { NotaComponent } from './nota.component';

describe('Nota Management Component', () => {
  let comp: NotaComponent;
  let fixture: ComponentFixture<NotaComponent>;
  let service: NotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NotaComponent],
    })
      .overrideTemplate(NotaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NotaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NotaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.notas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
