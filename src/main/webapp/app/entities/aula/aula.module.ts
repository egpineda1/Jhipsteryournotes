import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AulaComponent } from './list/aula.component';
import { AulaDetailComponent } from './detail/aula-detail.component';
import { AulaUpdateComponent } from './update/aula-update.component';
import { AulaDeleteDialogComponent } from './delete/aula-delete-dialog.component';
import { AulaRoutingModule } from './route/aula-routing.module';

@NgModule({
  imports: [SharedModule, AulaRoutingModule],
  declarations: [AulaComponent, AulaDetailComponent, AulaUpdateComponent, AulaDeleteDialogComponent],
  entryComponents: [AulaDeleteDialogComponent],
})
export class AulaModule {}
