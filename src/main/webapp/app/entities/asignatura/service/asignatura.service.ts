import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAsignatura, getAsignaturaIdentifier } from '../asignatura.model';

export type EntityResponseType = HttpResponse<IAsignatura>;
export type EntityArrayResponseType = HttpResponse<IAsignatura[]>;

@Injectable({ providedIn: 'root' })
export class AsignaturaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/asignaturas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(asignatura: IAsignatura): Observable<EntityResponseType> {
    return this.http.post<IAsignatura>(this.resourceUrl, asignatura, { observe: 'response' });
  }

  update(asignatura: IAsignatura): Observable<EntityResponseType> {
    return this.http.put<IAsignatura>(`${this.resourceUrl}/${getAsignaturaIdentifier(asignatura) as number}`, asignatura, {
      observe: 'response',
    });
  }

  partialUpdate(asignatura: IAsignatura): Observable<EntityResponseType> {
    return this.http.patch<IAsignatura>(`${this.resourceUrl}/${getAsignaturaIdentifier(asignatura) as number}`, asignatura, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAsignatura>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAsignatura[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAsignaturaToCollectionIfMissing(
    asignaturaCollection: IAsignatura[],
    ...asignaturasToCheck: (IAsignatura | null | undefined)[]
  ): IAsignatura[] {
    const asignaturas: IAsignatura[] = asignaturasToCheck.filter(isPresent);
    if (asignaturas.length > 0) {
      const asignaturaCollectionIdentifiers = asignaturaCollection.map(asignaturaItem => getAsignaturaIdentifier(asignaturaItem)!);
      const asignaturasToAdd = asignaturas.filter(asignaturaItem => {
        const asignaturaIdentifier = getAsignaturaIdentifier(asignaturaItem);
        if (asignaturaIdentifier == null || asignaturaCollectionIdentifiers.includes(asignaturaIdentifier)) {
          return false;
        }
        asignaturaCollectionIdentifiers.push(asignaturaIdentifier);
        return true;
      });
      return [...asignaturasToAdd, ...asignaturaCollection];
    }
    return asignaturaCollection;
  }
}
