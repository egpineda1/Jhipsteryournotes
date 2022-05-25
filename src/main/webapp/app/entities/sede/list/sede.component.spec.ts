import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SedeService } from '../service/sede.service';

import { SedeComponent } from './sede.component';

describe('Sede Management Component', () => {
  let comp: SedeComponent;
  let fixture: ComponentFixture<SedeComponent>;
  let service: SedeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SedeComponent],
    })
      .overrideTemplate(SedeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SedeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SedeService);

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
    expect(comp.sedes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
