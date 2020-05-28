import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealDetailsPage } from './deal-details';

@NgModule({
  declarations: [
    DealDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealDetailsPage),
  ],
})
export class DealDetailsPageModule {}
