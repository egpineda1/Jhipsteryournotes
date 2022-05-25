import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NotaComponent } from './list/nota.component';
import { NotaDetailComponent } from './detail/nota-detail.component';
import { NotaUpdateComponent } from './update/nota-update.component';
import { NotaDeleteDialogComponent } from './delete/nota-delete-dialog.component';
import { NotaRoutingModule } from './route/nota-routing.module';

@NgModule({
  imports: [SharedModule, NotaRoutingModule],
  declarations: [NotaComponent, NotaDetailComponent, NotaUpdateComponent, NotaDeleteDialogComponent],
  entryComponents: [NotaDeleteDialogComponent],
})
export class NotaModule {}
