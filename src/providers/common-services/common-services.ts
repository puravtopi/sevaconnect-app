import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the CommonServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonServicesProvider {

  constructor(public alertCtrl: AlertController, ) {
    console.log('Hello CommonServicesProvider Provider');
  }

   alertMessage(title: string, mess: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: mess,
      buttons: ['Ok']
    });
    alert.present();
  }

}
