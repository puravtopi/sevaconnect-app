import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchCouponsPage } from './search-coupons';

@NgModule({
  declarations: [
    SearchCouponsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchCouponsPage),
  ],
})
export class SearchCouponsPageModule {}
