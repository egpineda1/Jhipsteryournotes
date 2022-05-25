import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAula, getAulaIdentifier } from '../aula.model';

export type EntityResponseType = HttpResponse<IAula>;
export type EntityArrayResponseType = HttpResponse<IAula[]>;

@Injectable({ providedIn: 'root' })
export class AulaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/aulas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(aula: IAula): Observable<EntityResponseType> {
    return this.http.post<IAula>(this.resourceUrl, aula, { observe: 'response' });
  }

  update(aula: IAula): Observable<EntityResponseType> {
    return this.http.put<IAula>(`${this.resourceUrl}/${getAulaIdentifier(aula) as number}`, aula, { observe: 'response' });
  }

  partialUpdate(aula: IAula): Observable<EntityResponseType> {
    return this.http.patch<IAula>(`${this.resourceUrl}/${getAulaIdentifier(aula) as number}`, aula, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAula>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAula[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAulaToCollectionIfMissing(aulaCollection: IAula[], ...aulasToCheck: (IAula | null | undefined)[]): IAula[] {
    const aulas: IAula[] = aulasToCheck.filter(isPresent);
    if (aulas.length > 0) {
      const aulaCollectionIdentifiers = aulaCollection.map(aulaItem => getAulaIdentifier(aulaItem)!);
      const aulasToAdd = aulas.filter(aulaItem => {
        const aulaIdentifier = getAulaIdentifier(aulaItem);
        if (aulaIdentifier == null || aulaCollectionIdentifiers.includes(aulaIdentifier)) {
          return false;
        }
        aulaCollectionIdentifiers.push(aulaIdentifier);
        return true;
      });
      return [...aulasToAdd, ...aulaCollection];
    }
    return aulaCollection;
  }
}
