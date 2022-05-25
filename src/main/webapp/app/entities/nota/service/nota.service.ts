import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INota, getNotaIdentifier } from '../nota.model';

export type EntityResponseType = HttpResponse<INota>;
export type EntityArrayResponseType = HttpResponse<INota[]>;

@Injectable({ providedIn: 'root' })
export class NotaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(nota: INota): Observable<EntityResponseType> {
    return this.http.post<INota>(this.resourceUrl, nota, { observe: 'response' });
  }

  update(nota: INota): Observable<EntityResponseType> {
    return this.http.put<INota>(`${this.resourceUrl}/${getNotaIdentifier(nota) as number}`, nota, { observe: 'response' });
  }

  partialUpdate(nota: INota): Observable<EntityResponseType> {
    return this.http.patch<INota>(`${this.resourceUrl}/${getNotaIdentifier(nota) as number}`, nota, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INota>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INota[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNotaToCollectionIfMissing(notaCollection: INota[], ...notasToCheck: (INota | null | undefined)[]): INota[] {
    const notas: INota[] = notasToCheck.filter(isPresent);
    if (notas.length > 0) {
      const notaCollectionIdentifiers = notaCollection.map(notaItem => getNotaIdentifier(notaItem)!);
      const notasToAdd = notas.filter(notaItem => {
        const notaIdentifier = getNotaIdentifier(notaItem);
        if (notaIdentifier == null || notaCollectionIdentifiers.includes(notaIdentifier)) {
          return false;
        }
        notaCollectionIdentifiers.push(notaIdentifier);
        return true;
      });
      return [...notasToAdd, ...notaCollection];
    }
    return notaCollection;
  }
}
