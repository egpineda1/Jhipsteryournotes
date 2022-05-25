import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AsignaturaComponent } from './list/asignatura.component';
import { AsignaturaDetailComponent } from './detail/asignatura-detail.component';
import { AsignaturaUpdateComponent } from './update/asignatura-update.component';
import { AsignaturaDeleteDialogComponent } from './delete/asignatura-delete-dialog.component';
import { AsignaturaRoutingModule } from './route/asignatura-routing.module';

@NgModule({
  imports: [SharedModule, AsignaturaRoutingModule],
  declarations: [AsignaturaComponent, AsignaturaDetailComponent, AsignaturaUpdateComponent, AsignaturaDeleteDialogComponent],
  entryComponents: [AsignaturaDeleteDialogComponent],
})
export class AsignaturaModule {}
