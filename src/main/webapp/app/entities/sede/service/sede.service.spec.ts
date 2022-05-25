import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISede, Sede } from '../sede.model';

import { SedeService } from './sede.service';

describe('Sede Service', () => {
  let service: SedeService;
  let httpMock: HttpTestingController;
  let elemDefault: ISede;
  let expectedResult: ISede | ISede[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SedeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      correoSede: 'AAAAAAA',
      direccioSede: 'AAAAAAA',
      nombreSede: 'AAAAAAA',
      telefonoSede: 'AAAAAAA',
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

    it('should create a Sede', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Sede()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sede', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          correoSede: 'BBBBBB',
          direccioSede: 'BBBBBB',
          nombreSede: 'BBBBBB',
          telefonoSede: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Sede', () => {
      const patchObject = Object.assign(
        {
          nombreSede: 'BBBBBB',
        },
        new Sede()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Sede', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          correoSede: 'BBBBBB',
          direccioSede: 'BBBBBB',
          nombreSede: 'BBBBBB',
          telefonoSede: 'BBBBBB',
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

    it('should delete a Sede', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSedeToCollectionIfMissing', () => {
      it('should add a Sede to an empty array', () => {
        const sede: ISede = { id: 123 };
        expectedResult = service.addSedeToCollectionIfMissing([], sede);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sede);
      });

      it('should not add a Sede to an array that contains it', () => {
        const sede: ISede = { id: 123 };
        const sedeCollection: ISede[] = [
          {
            ...sede,
          },
          { id: 456 },
        ];
        expectedResult = service.addSedeToCollectionIfMissing(sedeCollection, sede);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sede to an array that doesn't contain it", () => {
        const sede: ISede = { id: 123 };
        const sedeCollection: ISede[] = [{ id: 456 }];
        expectedResult = service.addSedeToCollectionIfMissing(sedeCollection, sede);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sede);
      });

      it('should add only unique Sede to an array', () => {
        const sedeArray: ISede[] = [{ id: 123 }, { id: 456 }, { id: 76051 }];
        const sedeCollection: ISede[] = [{ id: 123 }];
        expectedResult = service.addSedeToCollectionIfMissing(sedeCollection, ...sedeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sede: ISede = { id: 123 };
        const sede2: ISede = { id: 456 };
        expectedResult = service.addSedeToCollectionIfMissing([], sede, sede2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sede);
        expect(expectedResult).toContain(sede2);
      });

      it('should accept null and undefined values', () => {
        const sede: ISede = { id: 123 };
        expectedResult = service.addSedeToCollectionIfMissing([], null, sede, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sede);
      });

      it('should return initial array if no Sede is added', () => {
        const sedeCollection: ISede[] = [{ id: 123 }];
        expectedResult = service.addSedeToCollectionIfMissing(sedeCollection, undefined, null);
        expect(expectedResult).toEqual(sedeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
