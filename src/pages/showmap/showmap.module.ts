import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowmapPage } from './showmap';

@NgModule({
  declarations: [
    ShowmapPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowmapPage),
  ],
})
export class ShowmapPageModule {}
