import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReporte, Reporte } from '../reporte.model';

import { ReporteService } from './reporte.service';

describe('Reporte Service', () => {
  let service: ReporteService;
  let httpMock: HttpTestingController;
  let elemDefault: IReporte;
  let expectedResult: IReporte | IReporte[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReporteService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      alerta: 'AAAAAAA',
      promedioFinal: 0,
      promedioParcial: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Reporte', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Reporte()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reporte', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          alerta: 'BBBBBB',
          promedioFinal: 1,
          promedioParcial: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reporte', () => {
      const patchObject = Object.assign(
        {
          promedioFinal: 1,
        },
        new Reporte()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reporte', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          alerta: 'BBBBBB',
          promedioFinal: 1,
          promedioParcial: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Reporte', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addReporteToCollectionIfMissing', () => {
      it('should add a Reporte to an empty array', () => {
        const reporte: IReporte = { id: 123 };
        expectedResult = service.addReporteToCollectionIfMissing([], reporte);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reporte);
      });

      it('should not add a Reporte to an array that contains it', () => {
        const reporte: IReporte = { id: 123 };
        const reporteCollection: IReporte[] = [
          {
            ...reporte,
          },
          { id: 456 },
        ];
        expectedResult = service.addReporteToCollectionIfMissing(reporteCollection, reporte);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reporte to an array that doesn't contain it", () => {
        const reporte: IReporte = { id: 123 };
        const reporteCollection: IReporte[] = [{ id: 456 }];
        expectedResult = service.addReporteToCollectionIfMissing(reporteCollection, reporte);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reporte);
      });

      it('should add only unique Reporte to an array', () => {
        const reporteArray: IReporte[] = [{ id: 123 }, { id: 456 }, { id: 27434 }];
        const reporteCollection: IReporte[] = [{ id: 123 }];
        expectedResult = service.addReporteToCollectionIfMissing(reporteCollection, ...reporteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reporte: IReporte = { id: 123 };
        const reporte2: IReporte = { id: 456 };
        expectedResult = service.addReporteToCollectionIfMissing([], reporte, reporte2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reporte);
        expect(expectedResult).toContain(reporte2);
      });

      it('should accept null and undefined values', () => {
        const reporte: IReporte = { id: 123 };
        expectedResult = service.addReporteToCollectionIfMissing([], null, reporte, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reporte);
      });

      it('should return initial array if no Reporte is added', () => {
        const reporteCollection: IReporte[] = [{ id: 123 }];
        expectedResult = service.addReporteToCollectionIfMissing(reporteCollection, undefined, null);
        expect(expectedResult).toEqual(reporteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
