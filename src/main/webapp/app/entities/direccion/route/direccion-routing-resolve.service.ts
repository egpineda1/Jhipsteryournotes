import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDireccion, Direccion } from '../direccion.model';
import { DireccionService } from '../service/direccion.service';

@Injectable({ providedIn: 'root' })
export class DireccionRoutingResolveService implements Resolve<IDireccion> {
  constructor(protected service: DireccionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDireccion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((direccion: HttpResponse<Direccion>) => {
          if (direccion.body) {
            return of(direccion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Direccion());
  }
}
