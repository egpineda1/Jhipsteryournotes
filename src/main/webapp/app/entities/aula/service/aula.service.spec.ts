import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAula, Aula } from '../aula.model';

import { AulaService } from './aula.service';

describe('Aula Service', () => {
  let service: AulaService;
  let httpMock: HttpTestingController;
  let elemDefault: IAula;
  let expectedResult: IAula | IAula[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AulaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      capacidadMaxima: 0,
      grado: 0,
      salon: 'AAAAAAA',
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

    it('should create a Aula', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Aula()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Aula', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          capacidadMaxima: 1,
          grado: 1,
          salon: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Aula', () => {
      const patchObject = Object.assign(
        {
          salon: 'BBBBBB',
        },
        new Aula()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Aula', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          capacidadMaxima: 1,
          grado: 1,
          salon: 'BBBBBB',
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

    it('should delete a Aula', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAulaToCollectionIfMissing', () => {
      it('should add a Aula to an empty array', () => {
        const aula: IAula = { id: 123 };
        expectedResult = service.addAulaToCollectionIfMissing([], aula);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(aula);
      });

      it('should not add a Aula to an array that contains it', () => {
        const aula: IAula = { id: 123 };
        const aulaCollection: IAula[] = [
          {
            ...aula,
          },
          { id: 456 },
        ];
        expectedResult = service.addAulaToCollectionIfMissing(aulaCollection, aula);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Aula to an array that doesn't contain it", () => {
        const aula: IAula = { id: 123 };
        const aulaCollection: IAula[] = [{ id: 456 }];
        expectedResult = service.addAulaToCollectionIfMissing(aulaCollection, aula);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aula);
      });

      it('should add only unique Aula to an array', () => {
        const aulaArray: IAula[] = [{ id: 123 }, { id: 456 }, { id: 48060 }];
        const aulaCollection: IAula[] = [{ id: 123 }];
        expectedResult = service.addAulaToCollectionIfMissing(aulaCollection, ...aulaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const aula: IAula = { id: 123 };
        const aula2: IAula = { id: 456 };
        expectedResult = service.addAulaToCollectionIfMissing([], aula, aula2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aula);
        expect(expectedResult).toContain(aula2);
      });

      it('should accept null and undefined values', () => {
        const aula: IAula = { id: 123 };
        expectedResult = service.addAulaToCollectionIfMissing([], null, aula, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(aula);
      });

      it('should return initial array if no Aula is added', () => {
        const aulaCollection: IAula[] = [{ id: 123 }];
        expectedResult = service.addAulaToCollectionIfMissing(aulaCollection, undefined, null);
        expect(expectedResult).toEqual(aulaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
