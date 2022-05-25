import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NotaComponent } from '../list/nota.component';
import { NotaDetailComponent } from '../detail/nota-detail.component';
import { NotaUpdateComponent } from '../update/nota-update.component';
import { NotaRoutingResolveService } from './nota-routing-resolve.service';

const notaRoute: Routes = [
  {
    path: '',
    component: NotaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NotaDetailComponent,
    resolve: {
      nota: NotaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NotaUpdateComponent,
    resolve: {
      nota: NotaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NotaUpdateComponent,
    resolve: {
      nota: NotaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(notaRoute)],
  exports: [RouterModule],
})
export class NotaRoutingModule {}
