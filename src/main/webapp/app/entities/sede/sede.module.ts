import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SedeComponent } from './list/sede.component';
import { SedeDetailComponent } from './detail/sede-detail.component';
import { SedeUpdateComponent } from './update/sede-update.component';
import { SedeDeleteDialogComponent } from './delete/sede-delete-dialog.component';
import { SedeRoutingModule } from './route/sede-routing.module';

@NgModule({
  imports: [SharedModule, SedeRoutingModule],
  declarations: [SedeComponent, SedeDetailComponent, SedeUpdateComponent, SedeDeleteDialogComponent],
  entryComponents: [SedeDeleteDialogComponent],
})
export class SedeModule {}
