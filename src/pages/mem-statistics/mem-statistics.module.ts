import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemStatisticsPage } from './mem-statistics';

@NgModule({
  declarations: [
    MemStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(MemStatisticsPage),
  ],
})
export class MemStatisticsPageModule {}
