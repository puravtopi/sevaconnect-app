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

import { Storage } from "@ionic/storage";

@Component({
  selector: "page-trip-detail",
  templateUrl: "trip-detail.html"
})
export class TripDetailPage {
  // list of offers
  public offers: any;
  public comments: any;
  public isMyComments = true;
  public userType: any;

  public offer = {
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
    offer_id: 0,
    corporate_name: "",
    retailer_name: "",
    rate: 0.0,
    totalcomment: 0,
    address: "",
    pin: ""
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

    public events: Events,
    private storage: Storage
  ) {
    this.getFromStorageAsync().then(val => {
      if (val != null) {
        sessionStorage.setItem("uData", val);
      }

      events.publish("user:login");
    });

    let offerId = this.navParams.get("id");
    let cnd = " where int_offer_id=" + offerId;

    //get user type
    this.userType = sessionStorage.getItem("uType");
    this.getOffers(cnd);
    this.getOffersComments(cnd);
  }

  async getFromStorageAsync() {
    return await this.storage.get("uData");
  }

  getOffers(cnd) {
    this.authServicesProvider
      .getOffersServices(cnd, 1, 5, "asc", "int_offer_id")
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;
        if (status == "Success") {
          this.offers = JSON.parse(
            JSON.stringify(this.responseData.OffersData),
            this.stringToDate
          );

          if (this.offers.length > 0) {
            this.offer.name = this.offers[0].str_offer_name;
            this.offer.img = this.offers[0].str_img;
            this.offer.desc = this.offers[0].str_offer_details;
            this.offer.will_get = this.offers[0].str_will_get;
            this.offer.retailer_id = this.offers[0].int_retailer_id;
            this.offer.offer_id = this.offers[0].int_offer_id;
            this.offer.corporate_name = this.offers[0].str_corporate_name;
            this.offer.retailer_name = this.offers[0].str_retailer_name;
            this.offer.rate = this.offers[0].rate;
            this.offer.pin = this.offers[0].int_pincode;

            this.offer.marketing_fee = this.offers[0].dec_marketing_fee;
            this.offer.address =
              this.offers[0].str_street_address +
              "," +
              this.offers[0].str_city_name +
              "," +
              this.offers[0].str_short_name;

            this.offer.discount_amount = this.offers[0].dec_discount_amount;
            this.offer.perc_off_amt = this.offers[0].dec_perc_off_amt;
            this.offer.location =
              this.offers[0].str_street_address +
              ", " +
              this.offers[0].int_zip_code +
              " " +
              this.offers[0].str_city_name +
              ", " +
              this.offers[0].str_state_name;

            //let dateString = this.offers[0].date_end_date;

            let dateString1 = this.offers[0].date_end_date;

            let newDate = new Date();
            let newDate1 = new Date(dateString1);

            var diff = Math.abs(newDate1.getTime() - newDate.getTime());

            var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

            //calculate price
            if (this.offers[0].dec_discount_amount > 0) {
              this.offer.price = this.offers[0].dec_discount_amount;
              this.offer.purchase_amt = this.offers[0].dec_original_price;
            } else {
              let amt =
                (this.offers[0].dec_perc_off_amt *
                  this.offers[0].dec_purchase_amt) /
                100;
              amt = this.offers[0].dec_purchase_amt - amt;

              this.offer.price = amt;
              this.offer.purchase_amt = this.offers[0].dec_purchase_amt;
            }

            this.offer.enddays = diffDays;
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

        this.offer.totalcomment = this.comments.length;

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
    let forgot = this.alertCtrl.create({
      title: "Enter Merchant Security Pin",
      message: "Enter security pin of merchant for valid Redeem.",
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
            if (data.pinCode == this.offer.pin) this.saveTransaction();
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
  }

  saveTransaction() {
    let purchaseamt = this.offer.purchase_amt * this.reDeem;
    let totalsaving =
      (this.offer.purchase_amt - this.offer.price) * this.reDeem;
    let marketingamt = this.offer.marketing_fee * this.reDeem;
    let shareamt = marketingamt / 2;
    let userData = sessionStorage.getItem("uData");
    let tempUserData = JSON.parse(userData);

    this.authServicesProvider
      .saveTransactionServices(
        tempUserData.int_user_id,
        this.offer.retailer_id,
        this.offer.offer_id,
        shareamt,
        purchaseamt,
        totalsaving,
        marketingamt,
        this.reDeem,
        "0",
        "0",
        "0"
      )
      .then(result => {
        let toast = this.toastCtrl.create({
          message: "Thanks for Redeem Coupons.",
          duration: 3000,
          position: "top",
          cssClass: "dark-trans",
          closeButtonText: "OK",
          showCloseButton: true
        });
        toast.present();

        this.nav.pop();
      });
  }

  saveComments() {
    let userData = sessionStorage.getItem("uData");
    let tempUserData = JSON.parse(userData);

    this.authServicesProvider
      .insertCommentsServices(
        this.offer.retailer_id,
        tempUserData.int_user_id,
        this.comment.rate,
        this.comment.desc,
        this.offer.offer_id
      )
      .then(result => {
        let toast = this.toastCtrl.create({
          message: "Thanks for your comments.",
          duration: 3000,
          position: "bottom",
          cssClass: "dark-trans",
          closeButtonText: "OK",
          showCloseButton: true
        });
        toast.present();

        this.nav.pop();
      });
  }

  // whatsappShare() {
  //   this.socialSharing
  //     .shareViaWhatsApp(
  //       "Message via WhatsApp",
  //       null /*Image*/,
  //       "https://pointdeveloper.com/" /* url */
  //     )
  //     .then(
  //       () => {
  //         alert("Success");
  //       },
  //       () => {
  //         alert("failed");
  //       }
  //     );
  // }

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
