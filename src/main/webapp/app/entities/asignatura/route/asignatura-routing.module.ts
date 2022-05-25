import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AsignaturaComponent } from '../list/asignatura.component';
import { AsignaturaDetailComponent } from '../detail/asignatura-detail.component';
import { AsignaturaUpdateComponent } from '../update/asignatura-update.component';
import { AsignaturaRoutingResolveService } from './asignatura-routing-resolve.service';

const asignaturaRoute: Routes = [
  {
    path: '',
    component: AsignaturaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AsignaturaDetailComponent,
    resolve: {
      asignatura: AsignaturaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AsignaturaUpdateComponent,
    resolve: {
      asignatura: AsignaturaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AsignaturaUpdateComponent,
    resolve: {
      asignatura: AsignaturaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(asignaturaRoute)],
  exports: [RouterModule],
})
export class AsignaturaRoutingModule {}
