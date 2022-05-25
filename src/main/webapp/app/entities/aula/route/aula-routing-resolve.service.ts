import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAula, Aula } from '../aula.model';
import { AulaService } from '../service/aula.service';

@Injectable({ providedIn: 'root' })
export class AulaRoutingResolveService implements Resolve<IAula> {
  constructor(protected service: AulaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAula> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((aula: HttpResponse<Aula>) => {
          if (aula.body) {
            return of(aula.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Aula());
  }
}
