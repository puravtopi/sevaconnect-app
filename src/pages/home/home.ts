import { Component } from "@angular/core";
import { NavController, PopoverController, Events, LoadingController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { NotificationsPage } from "../notifications/notifications";
import { SettingsPage } from "../settings/settings";
import { TransactionhistoryPage } from "../transactionhistory/transactionhistory";
import { SearchLocationPage } from "../search-location/search-location";
import { AuthenticationServicesProvider } from '../../providers/authentication-services/authentication-services';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


  public savingData = { purchaseamt: 0, savingamt: 0 };
  responseData: any;
  dataset: any;
  loader: any;



  constructor(public nav: NavController, public popoverCtrl: PopoverController, public events: Events, public authServicesProvider: AuthenticationServicesProvider, private storage: Storage, public loadingCtrl: LoadingController) {



    this.getFromStorageAsync().then((val) => {


      if (val != null) {
        sessionStorage.setItem("uData", val);
      }

      events.publish('user:login');
      this.getSavingPurchaseData();

      this.loader.dismiss();
    });
  }

  async getFromStorageAsync() {

    this.loader = this.loadingCtrl.create({
      content: 'Featching Data...',
    });

    this.loader.present();
    return await this.storage.get('uData');

  }

  changeSubCategory(catId) {

    this.nav.push(SearchLocationPage, catId);
  }

  // to go account page
  goToAccount() {
    this.nav.push(SettingsPage);
  }

  viewHistory(){
    alert('call');
    this.nav.push(TransactionhistoryPage);
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create(NotificationsPage);
    popover.present({
      ev: myEvent
    });
  }



  getSavingPurchaseData() {
    let userData = sessionStorage.getItem("uData");

    let tempUserData = JSON.parse(userData);

    this.authServicesProvider.getSavingPurchaseDataServices(tempUserData.int_user_id).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.dataset = this.responseData.SavingData;

        if (this.dataset.length > 0) {
          this.savingData.purchaseamt = this.dataset[0].purchaseamt;
          this.savingData.savingamt = this.dataset[0].savingamt;
        }
      }
    });

  }

}

//
