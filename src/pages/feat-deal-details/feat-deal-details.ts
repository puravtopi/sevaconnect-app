import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  ToastController,
  Events
} from "ionic-angular";
import { TripService } from "../../services/trip-service";
import { CheckoutTripPage } from "../checkout-trip/checkout-trip";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { DatePipe } from "@angular/common";

import { Storage } from "@ionic/storage";

/**
 * Generated class for the FeatDealDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-feat-deal-details",
  templateUrl: "feat-deal-details.html"
})
export class FeatDealDetailsPage {
  // list of offers
  public deals: any;
  public comments: any;
  public isMyComments = true;
  public userType: any;

  public deal = {
    name: "",
    img: "",
    desc: "",
    will_get: "",
    enddays: 0,
    discount_amount: 0.0,
    perc_off_amt: 0.0,
    price: 0.0,
    location: "",
    retailer_id: 0,
    purchase_amt: 0.0,
    marketing_fee: 0.0,
    deal_id: 0,
    corporate_name: "",
    retailer_name: "",
    rate: 0.0,
    totalcomment: 0,
    address: "",
    pin: "",
    date_campaign_date: Date
  };
  public comment = {
    rate: 0,
    desc: ""
  };
  public todayDate: Date = new Date();
  responseData: any;

  // trip info
  public trip: any;
  // number of adult
  public reDeem = 1;

  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public tripService: TripService,
    public authServicesProvider: AuthenticationServicesProvider,
    public alertCtrl: AlertController,
    public datepipe: DatePipe,
    public events: Events,
    private storage: Storage
  ) {
    this.getFromStorageAsync().then(val => {
      if (val != null) {
        sessionStorage.setItem("uData", val);
      }

      events.publish("user:login");
    });

    let dealId = this.navParams.get("id");
    let cnd = " where int_deal_id=" + dealId;

    //get user type
    this.userType = sessionStorage.getItem("uType");
    this.getOffers(cnd);

    cnd = " where int_f_deal_id=" + dealId;

    this.getOffersComments(cnd);
  }

  async getFromStorageAsync() {
    return await this.storage.get("uData");
  }

  getOffers(cnd) {
    this.authServicesProvider
      .getFeaturedDealsServices(cnd, 1, 5, "asc", "int_deal_id")
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;
        if (status == "Success") {
          this.deals = JSON.parse(
            JSON.stringify(this.responseData.DealsData),
            this.stringToDate
          );

          if (this.deals.length > 0) {
            this.deal.name = this.deals[0].str_deal_name;
            this.deal.img = this.deals[0].str_img;
            this.deal.desc = this.deals[0].str_deal_details;
            this.deal.will_get = this.deals[0].str_will_get;
            this.deal.retailer_id = this.deals[0].int_retailer_id;
            this.deal.deal_id = this.deals[0].int_deal_id;
            this.deal.corporate_name = this.deals[0].str_corporate_name;
            this.deal.retailer_name = this.deals[0].str_retailer_name;
            this.deal.date_campaign_date = this.deals[0].date_campaign_date;

            this.deal.pin = this.deals[0].int_pincode;

            alert(this.deal.pin);
            alert(this.deal.retailer_id);

            this.deal.marketing_fee =
              this.deals[0].dec_marketing_fee === undefined
                ? 1
                : this.deals[0].dec_marketing_fee;

            alert(this.deal.marketing_fee);

            this.deal.address = this.deals[0].location;

            this.deal.discount_amount = this.deals[0].dec_discount_amount;
            //this.deal.perc_off_amt = this.deals[0].dec_perc_off_amt;
            this.deal.location = this.deals[0].location;

            //calculate price
            if (this.deals[0].dec_discount_amount > 0) {
              this.deal.price = this.deals[0].dec_discount_amount;
              this.deal.purchase_amt = this.deals[0].dec_original_price;
            } else {
              let amt =
                (this.deals[0].dec_perc_off_amt *
                  this.deals[0].dec_purchase_amt) /
                100;
              amt = this.deals[0].dec_purchase_amt - amt;

              this.deal.price = amt;
              this.deal.purchase_amt = this.deals[0].dec_purchase_amt;
            }

            this.deal.enddays = 1;
          }
        }
      });
  }

  getOffersComments(cnd) {
    let userData = sessionStorage.getItem("uData");
    let tempUserData = JSON.parse(userData);

    this.authServicesProvider.getOfferCommentsServices(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.comments = this.responseData.CommentsData;
        if (
          this.comments.filter(function(d, i) {
            return d.int_user_id == tempUserData.int_user_id;
          }).length > 0
        )
          this.isMyComments = false;
        else this.isMyComments = true;

        this.deal.totalcomment = this.comments.length;

        if (this.comments.length > 5) {
          this.comments = this.comments.slic(0, 5);
        }

        console.log(JSON.stringify(this.comments));
      }
    });
  }

  // minus adult when click minus button
  minusRedeem() {
    if (this.reDeem > 1) this.reDeem--;
  }

  // plus adult when click plus button
  plusRedeem() {
    this.reDeem++;
  }

  // go to checkout page
  checkout() {
    this.nav.push(CheckoutTripPage);
  }

  verifyPin() {
    let today = new Date();
    let t_date = this.datepipe.transform(today, "MM/dd/yyyy");

    let c_date = this.datepipe.transform(
      this.deal.date_campaign_date,
      "MM/dd/yyyy"
    );

    if (t_date === c_date) {
      let forgot = this.alertCtrl.create({
        title: "Enter Business Onwer Pin",
        message: "Enter security pin of business onwer for valid Redeem.",
        inputs: [
          {
            name: "pinCode",
            placeholder: "Enter Pin",
            type: "password"
          }
        ],
        buttons: [
          {
            text: "Cancel",
            handler: data => {
              console.log("Cancel clicked");
            }
          },
          {
            text: "Verify",
            handler: data => {
              console.log("Send clicked");
              if (data.pinCode == this.deal.pin) this.saveTransaction();
              else {
                let toast = this.toastCtrl.create({
                  message: "Sorry! Invalid Pin.",
                  duration: 3000,
                  position: "top",
                  cssClass: "dark-trans",
                  closeButtonText: "OK",
                  showCloseButton: true
                });
                toast.present();
              }
            }
          }
        ]
      });
      forgot.present();
    } else {
      let msg = this.alertCtrl.create({
        title: "Seva Connect",
        message: "Sorry,you can redeem this deal on " + c_date + " only.",

        buttons: [
          {
            text: "Ok",
            handler: data => {
              console.log("Cancel clicked");
            }
          }
        ]
      });
      msg.present();
    }
  }

  saveTransaction() {
    let purchaseamt = this.deal.purchase_amt * this.reDeem;
    let totalsaving = (this.deal.purchase_amt - this.deal.price) * this.reDeem;
    let marketingamt = this.deal.marketing_fee * this.reDeem;
    let shareamt = marketingamt / 2;
    let userData = sessionStorage.getItem("uData");
    let tempUserData = JSON.parse(userData);

    this.authServicesProvider
      .saveTransactionServices(
        tempUserData.int_user_id,
        this.deal.retailer_id,
        "0",
        shareamt,
        purchaseamt,
        totalsaving,
        marketingamt,
        this.reDeem,
        "0",
        "0",
        this.deal.deal_id
      )
      .then(result => {
        let mess = "";

        this.responseData = result;

        if (this.responseData.Status == "success")
          mess = "Thanks for Redeem deal.";
        else {
          if (this.responseData.result === -1)
            mess =
              "Sorry ! you already redeem this deal for today,try again tomorrow.";
          else
            mess = "Sorry ! there may be any issue in redeem deal right now.";
        }

        let toast = this.toastCtrl.create({
          message: mess,
          duration: 3000,
          position: "top",
          cssClass: "dark-trans",
          closeButtonText: "OK",
          showCloseButton: true
        });
        toast.present();

        if (this.responseData.Status == "success") this.nav.pop();
      });
  }

  saveComments() {
    let userData = sessionStorage.getItem("uData");
    let tempUserData = JSON.parse(userData);

    this.authServicesProvider
      .insertCommentsServices(
        this.deal.retailer_id,
        tempUserData.int_user_id,
        this.comment.rate,
        this.comment.desc,
        0,
        0,
        this.deal.deal_id
      )
      .then(result => {
        let mess = "";

        this.responseData = result;

        if (this.responseData.Status == "success")
          mess = "Thanks for your comments.";
        else
          mess = "Sorry ! there may be any issue in saving comments right now.";

        let toast = this.toastCtrl.create({
          message: mess,
          duration: 3000,
          position: "bottom",
          cssClass: "dark-trans",
          closeButtonText: "OK",
          showCloseButton: true
        });

        toast.present();

        if (this.responseData.Status == "success") this.nav.pop();
      });
  }

  public stringToDate(key: any, value: any) {
    var reDateDetect = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    if (
      typeof value == "string" &&
      reDateDetect.exec(value) &&
      value != "0001-01-01T00:00:00"
    ) {
      return new Date(value);
    }
    return value;
  }
}
