import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrgBioPage } from './org-bio';

@NgModule({
  declarations: [
    OrgBioPage,
  ],
  imports: [
    IonicPageModule.forChild(OrgBioPage),
  ],
})
export class OrgBioPageModule {}
