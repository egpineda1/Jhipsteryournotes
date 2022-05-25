import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INota, Nota } from '../nota.model';
import { NotaService } from '../service/nota.service';

@Injectable({ providedIn: 'root' })
export class NotaRoutingResolveService implements Resolve<INota> {
  constructor(protected service: NotaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INota> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((nota: HttpResponse<Nota>) => {
          if (nota.body) {
            return of(nota.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Nota());
  }
}
