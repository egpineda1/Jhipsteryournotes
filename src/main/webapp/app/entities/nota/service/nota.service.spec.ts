import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INota, Nota } from '../nota.model';

import { NotaService } from './nota.service';

describe('Nota Service', () => {
  let service: NotaService;
  let httpMock: HttpTestingController;
  let elemDefault: INota;
  let expectedResult: INota | INota[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NotaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nota: 0,
      observaciones: 'AAAAAAA',
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

    it('should create a Nota', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Nota()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Nota', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nota: 1,
          observaciones: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Nota', () => {
      const patchObject = Object.assign(
        {
          observaciones: 'BBBBBB',
        },
        new Nota()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Nota', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nota: 1,
          observaciones: 'BBBBBB',
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

    it('should delete a Nota', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNotaToCollectionIfMissing', () => {
      it('should add a Nota to an empty array', () => {
        const nota: INota = { id: 123 };
        expectedResult = service.addNotaToCollectionIfMissing([], nota);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nota);
      });

      it('should not add a Nota to an array that contains it', () => {
        const nota: INota = { id: 123 };
        const notaCollection: INota[] = [
          {
            ...nota,
          },
          { id: 456 },
        ];
        expectedResult = service.addNotaToCollectionIfMissing(notaCollection, nota);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Nota to an array that doesn't contain it", () => {
        const nota: INota = { id: 123 };
        const notaCollection: INota[] = [{ id: 456 }];
        expectedResult = service.addNotaToCollectionIfMissing(notaCollection, nota);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nota);
      });

      it('should add only unique Nota to an array', () => {
        const notaArray: INota[] = [{ id: 123 }, { id: 456 }, { id: 46606 }];
        const notaCollection: INota[] = [{ id: 123 }];
        expectedResult = service.addNotaToCollectionIfMissing(notaCollection, ...notaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const nota: INota = { id: 123 };
        const nota2: INota = { id: 456 };
        expectedResult = service.addNotaToCollectionIfMissing([], nota, nota2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nota);
        expect(expectedResult).toContain(nota2);
      });

      it('should accept null and undefined values', () => {
        const nota: INota = { id: 123 };
        expectedResult = service.addNotaToCollectionIfMissing([], null, nota, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nota);
      });

      it('should return initial array if no Nota is added', () => {
        const notaCollection: INota[] = [{ id: 123 }];
        expectedResult = service.addNotaToCollectionIfMissing(notaCollection, undefined, null);
        expect(expectedResult).toEqual(notaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
