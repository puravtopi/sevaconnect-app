import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripSearchPage } from './trip-search';

@NgModule({
  declarations: [
    TripSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(TripSearchPage),
  ],
})
export class TripSearchPageModule {}
