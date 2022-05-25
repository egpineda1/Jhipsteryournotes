import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAsignatura, Asignatura } from '../asignatura.model';

import { AsignaturaService } from './asignatura.service';

describe('Asignatura Service', () => {
  let service: AsignaturaService;
  let httpMock: HttpTestingController;
  let elemDefault: IAsignatura;
  let expectedResult: IAsignatura | IAsignatura[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AsignaturaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      codeAsignatura: 0,
      asignatura: 'AAAAAAA',
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

    it('should create a Asignatura', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Asignatura()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Asignatura', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codeAsignatura: 1,
          asignatura: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Asignatura', () => {
      const patchObject = Object.assign({}, new Asignatura());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Asignatura', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codeAsignatura: 1,
          asignatura: 'BBBBBB',
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

    it('should delete a Asignatura', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAsignaturaToCollectionIfMissing', () => {
      it('should add a Asignatura to an empty array', () => {
        const asignatura: IAsignatura = { id: 123 };
        expectedResult = service.addAsignaturaToCollectionIfMissing([], asignatura);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(asignatura);
      });

      it('should not add a Asignatura to an array that contains it', () => {
        const asignatura: IAsignatura = { id: 123 };
        const asignaturaCollection: IAsignatura[] = [
          {
            ...asignatura,
          },
          { id: 456 },
        ];
        expectedResult = service.addAsignaturaToCollectionIfMissing(asignaturaCollection, asignatura);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Asignatura to an array that doesn't contain it", () => {
        const asignatura: IAsignatura = { id: 123 };
        const asignaturaCollection: IAsignatura[] = [{ id: 456 }];
        expectedResult = service.addAsignaturaToCollectionIfMissing(asignaturaCollection, asignatura);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(asignatura);
      });

      it('should add only unique Asignatura to an array', () => {
        const asignaturaArray: IAsignatura[] = [{ id: 123 }, { id: 456 }, { id: 16596 }];
        const asignaturaCollection: IAsignatura[] = [{ id: 123 }];
        expectedResult = service.addAsignaturaToCollectionIfMissing(asignaturaCollection, ...asignaturaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const asignatura: IAsignatura = { id: 123 };
        const asignatura2: IAsignatura = { id: 456 };
        expectedResult = service.addAsignaturaToCollectionIfMissing([], asignatura, asignatura2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(asignatura);
        expect(expectedResult).toContain(asignatura2);
      });

      it('should accept null and undefined values', () => {
        const asignatura: IAsignatura = { id: 123 };
        expectedResult = service.addAsignaturaToCollectionIfMissing([], null, asignatura, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(asignatura);
      });

      it('should return initial array if no Asignatura is added', () => {
        const asignaturaCollection: IAsignatura[] = [{ id: 123 }];
        expectedResult = service.addAsignaturaToCollectionIfMissing(asignaturaCollection, undefined, null);
        expect(expectedResult).toEqual(asignaturaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
