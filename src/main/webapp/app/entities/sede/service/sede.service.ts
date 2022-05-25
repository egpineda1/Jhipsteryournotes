import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISede, getSedeIdentifier } from '../sede.model';

export type EntityResponseType = HttpResponse<ISede>;
export type EntityArrayResponseType = HttpResponse<ISede[]>;

@Injectable({ providedIn: 'root' })
export class SedeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sedes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sede: ISede): Observable<EntityResponseType> {
    return this.http.post<ISede>(this.resourceUrl, sede, { observe: 'response' });
  }

  update(sede: ISede): Observable<EntityResponseType> {
    return this.http.put<ISede>(`${this.resourceUrl}/${getSedeIdentifier(sede) as number}`, sede, { observe: 'response' });
  }

  partialUpdate(sede: ISede): Observable<EntityResponseType> {
    return this.http.patch<ISede>(`${this.resourceUrl}/${getSedeIdentifier(sede) as number}`, sede, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISede>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISede[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSedeToCollectionIfMissing(sedeCollection: ISede[], ...sedesToCheck: (ISede | null | undefined)[]): ISede[] {
    const sedes: ISede[] = sedesToCheck.filter(isPresent);
    if (sedes.length > 0) {
      const sedeCollectionIdentifiers = sedeCollection.map(sedeItem => getSedeIdentifier(sedeItem)!);
      const sedesToAdd = sedes.filter(sedeItem => {
        const sedeIdentifier = getSedeIdentifier(sedeItem);
        if (sedeIdentifier == null || sedeCollectionIdentifiers.includes(sedeIdentifier)) {
          return false;
        }
        sedeCollectionIdentifiers.push(sedeIdentifier);
        return true;
      });
      return [...sedesToAdd, ...sedeCollection];
    }
    return sedeCollection;
  }
}
