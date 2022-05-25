import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDireccion, Direccion } from '../direccion.model';

import { DireccionService } from './direccion.service';

describe('Direccion Service', () => {
  let service: DireccionService;
  let httpMock: HttpTestingController;
  let elemDefault: IDireccion;
  let expectedResult: IDireccion | IDireccion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DireccionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      barrio: 'AAAAAAA',
      ciudad: 'AAAAAAA',
      departamento: 'AAAAAAA',
      numeracion: 'AAAAAAA',
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

    it('should create a Direccion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Direccion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Direccion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          barrio: 'BBBBBB',
          ciudad: 'BBBBBB',
          departamento: 'BBBBBB',
          numeracion: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Direccion', () => {
      const patchObject = Object.assign(
        {
          ciudad: 'BBBBBB',
          departamento: 'BBBBBB',
        },
        new Direccion()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Direccion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          barrio: 'BBBBBB',
          ciudad: 'BBBBBB',
          departamento: 'BBBBBB',
          numeracion: 'BBBBBB',
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

    it('should delete a Direccion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDireccionToCollectionIfMissing', () => {
      it('should add a Direccion to an empty array', () => {
        const direccion: IDireccion = { id: 123 };
        expectedResult = service.addDireccionToCollectionIfMissing([], direccion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(direccion);
      });

      it('should not add a Direccion to an array that contains it', () => {
        const direccion: IDireccion = { id: 123 };
        const direccionCollection: IDireccion[] = [
          {
            ...direccion,
          },
          { id: 456 },
        ];
        expectedResult = service.addDireccionToCollectionIfMissing(direccionCollection, direccion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Direccion to an array that doesn't contain it", () => {
        const direccion: IDireccion = { id: 123 };
        const direccionCollection: IDireccion[] = [{ id: 456 }];
        expectedResult = service.addDireccionToCollectionIfMissing(direccionCollection, direccion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(direccion);
      });

      it('should add only unique Direccion to an array', () => {
        const direccionArray: IDireccion[] = [{ id: 123 }, { id: 456 }, { id: 79301 }];
        const direccionCollection: IDireccion[] = [{ id: 123 }];
        expectedResult = service.addDireccionToCollectionIfMissing(direccionCollection, ...direccionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const direccion: IDireccion = { id: 123 };
        const direccion2: IDireccion = { id: 456 };
        expectedResult = service.addDireccionToCollectionIfMissing([], direccion, direccion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(direccion);
        expect(expectedResult).toContain(direccion2);
      });

      it('should accept null and undefined values', () => {
        const direccion: IDireccion = { id: 123 };
        expectedResult = service.addDireccionToCollectionIfMissing([], null, direccion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(direccion);
      });

      it('should return initial array if no Direccion is added', () => {
        const direccionCollection: IDireccion[] = [{ id: 123 }];
        expectedResult = service.addDireccionToCollectionIfMissing(direccionCollection, undefined, null);
        expect(expectedResult).toEqual(direccionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
