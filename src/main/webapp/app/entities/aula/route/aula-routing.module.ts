import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AulaComponent } from '../list/aula.component';
import { AulaDetailComponent } from '../detail/aula-detail.component';
import { AulaUpdateComponent } from '../update/aula-update.component';
import { AulaRoutingResolveService } from './aula-routing-resolve.service';

const aulaRoute: Routes = [
  {
    path: '',
    component: AulaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AulaDetailComponent,
    resolve: {
      aula: AulaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AulaUpdateComponent,
    resolve: {
      aula: AulaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AulaUpdateComponent,
    resolve: {
      aula: AulaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(aulaRoute)],
  exports: [RouterModule],
})
export class AulaRoutingModule {}
