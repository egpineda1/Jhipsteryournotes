import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAsignatura, Asignatura } from '../asignatura.model';
import { AsignaturaService } from '../service/asignatura.service';

@Injectable({ providedIn: 'root' })
export class AsignaturaRoutingResolveService implements Resolve<IAsignatura> {
  constructor(protected service: AsignaturaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAsignatura> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((asignatura: HttpResponse<Asignatura>) => {
          if (asignatura.body) {
            return of(asignatura.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Asignatura());
  }
}
