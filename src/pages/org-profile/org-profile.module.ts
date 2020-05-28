import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrgProfilePage } from './org-profile';

@NgModule({
  declarations: [
    OrgProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(OrgProfilePage),
  ],
})
export class OrgProfilePageModule {}
