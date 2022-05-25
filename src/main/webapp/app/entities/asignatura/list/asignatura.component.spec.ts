import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AsignaturaService } from '../service/asignatura.service';

import { AsignaturaComponent } from './asignatura.component';

describe('Asignatura Management Component', () => {
  let comp: AsignaturaComponent;
  let fixture: ComponentFixture<AsignaturaComponent>;
  let service: AsignaturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AsignaturaComponent],
    })
      .overrideTemplate(AsignaturaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AsignaturaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AsignaturaService);

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
    expect(comp.asignaturas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
