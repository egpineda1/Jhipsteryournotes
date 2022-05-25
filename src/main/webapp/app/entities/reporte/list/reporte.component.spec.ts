import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReporteService } from '../service/reporte.service';

import { ReporteComponent } from './reporte.component';

describe('Reporte Management Component', () => {
  let comp: ReporteComponent;
  let fixture: ComponentFixture<ReporteComponent>;
  let service: ReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ReporteComponent],
    })
      .overrideTemplate(ReporteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReporteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReporteService);

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
    expect(comp.reportes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
