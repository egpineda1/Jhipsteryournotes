import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReporte, getReporteIdentifier } from '../reporte.model';

export type EntityResponseType = HttpResponse<IReporte>;
export type EntityArrayResponseType = HttpResponse<IReporte[]>;

@Injectable({ providedIn: 'root' })
export class ReporteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reportes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reporte: IReporte): Observable<EntityResponseType> {
    return this.http.post<IReporte>(this.resourceUrl, reporte, { observe: 'response' });
  }

  update(reporte: IReporte): Observable<EntityResponseType> {
    return this.http.put<IReporte>(`${this.resourceUrl}/${getReporteIdentifier(reporte) as number}`, reporte, { observe: 'response' });
  }

  partialUpdate(reporte: IReporte): Observable<EntityResponseType> {
    return this.http.patch<IReporte>(`${this.resourceUrl}/${getReporteIdentifier(reporte) as number}`, reporte, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReporte>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReporte[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReporteToCollectionIfMissing(reporteCollection: IReporte[], ...reportesToCheck: (IReporte | null | undefined)[]): IReporte[] {
    const reportes: IReporte[] = reportesToCheck.filter(isPresent);
    if (reportes.length > 0) {
      const reporteCollectionIdentifiers = reporteCollection.map(reporteItem => getReporteIdentifier(reporteItem)!);
      const reportesToAdd = reportes.filter(reporteItem => {
        const reporteIdentifier = getReporteIdentifier(reporteItem);
        if (reporteIdentifier == null || reporteCollectionIdentifiers.includes(reporteIdentifier)) {
          return false;
        }
        reporteCollectionIdentifiers.push(reporteIdentifier);
        return true;
      });
      return [...reportesToAdd, ...reporteCollection];
    }
    return reporteCollection;
  }
}
