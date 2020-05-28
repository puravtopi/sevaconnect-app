import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { TripDetailPage } from "../trip-detail/trip-detail";

/**
 * Generated class for the TransactionhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-transactionhistory",
  templateUrl: "transactionhistory.html"
})
export class TransactionhistoryPage {
  public transactionData: any;
  responseData: any;
  public savingData = { purchaseamt: 0, savingamt: 0 };
  dataset: any;
  data = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider
  ) {
    let userData = sessionStorage.getItem("uData");
    let tempUserData = JSON.parse(userData);
    this.getSavingPurchaseData(tempUserData.int_user_id);
    this.getTransactions(tempUserData.int_user_id);

    for (let i = 0; i < 100; i++) {
      this.data.push(i);
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TransactionhistoryPage");
  }

  getTransactions(userId) {
    let cnd = " where int_user_id=" + userId;

    this.authServicesProvider.getTransactionServices(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.transactionData = this.responseData.TransactionData;
      }
    });
  }

  getSavingPurchaseData(userId) {
    this.authServicesProvider
      .getSavingPurchaseDataServices(userId)
      .then(result => {
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

  // view trip detail
  viewDetail(id) {
    this.navCtrl.push(TripDetailPage, { id: id });
  }
}
