import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AulaService } from '../service/aula.service';

import { AulaComponent } from './aula.component';

describe('Aula Management Component', () => {
  let comp: AulaComponent;
  let fixture: ComponentFixture<AulaComponent>;
  let service: AulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AulaComponent],
    })
      .overrideTemplate(AulaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AulaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AulaService);

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
    expect(comp.aulas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
