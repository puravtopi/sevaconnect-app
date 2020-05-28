import { Component } from "@angular/core";
import { IonicPage, NavController, LoadingController } from "ionic-angular";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { TripDetailPage } from "../trip-detail/trip-detail";
import { SearchLocationPage } from "../search-location/search-location";

/**
 * Generated class for the RetOffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-ret-offers",
  templateUrl: "ret-offers.html"
})
export class RetOffersPage {
  public offers: any;
  public cnd: any;
  public responseData: any;
  public todayDate: Date = new Date();
  pageIdex = 1;
  totalCount = 0;

  priceRange = 0;
  subcatId = 0;
  offerOption = "0";
  reActiveInfinite: any;

  constructor(
    public navCtrl: NavController,

    public authServicesProvider: AuthenticationServicesProvider,
    public loadingCtrl: LoadingController
  ) {
    let userData = JSON.parse(sessionStorage.getItem("uData"));

    this.getOffers(" where int_retailer_id=" + userData.int_retailer_id);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RetOffersPage");
  }

  getOffers(cnd, infiniteScroll?) {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });

    loader.present();

    this.authServicesProvider
      .getOffersServices(cnd, this.pageIdex, 5, "desc", "int_offer_id")
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;
        if (status == "Success") {
          this.offers =
            this.offers != null
              ? this.offers.concat(this.responseData.OffersData)
              : this.responseData.OffersData;
          this.offers = this.offers.map(function(d, i) {
            var diff = Math.abs(
              new Date(d.date_end_date).getTime() - new Date().getTime()
            );
            var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

            d.endDays = diffDays;

            var price = 0.0;
            var purchase_amt = 0.0;

            //calculate price
            if (d.dec_discount_amount > 0) {
              price = d.dec_discount_amount;
              purchase_amt = d.dec_original_price;
            } else {
              let amt = (d.dec_perc_off_amt * d.dec_purchase_amt) / 100;
              amt = d.dec_purchase_amt - amt;

              price = amt;
              purchase_amt = d.dec_purchase_amt;
            }
            d.orgprice = purchase_amt;
            d.discountprice = price;

            return d;
          });
          this.totalCount = this.responseData.totalRecord;
        }
        console.log(JSON.stringify(this.offers));
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      });

    loader.dismiss();
  }

  loadMore(infiniteScroll) {
    this.reActiveInfinite = infiniteScroll;

    this.pageIdex++;

    this.getOffers(this.cnd, infiniteScroll);
    let pages = 0;
    if (this.totalCount > 0) pages = Math.ceil(this.totalCount / 2);

    if (this.pageIdex === pages) {
      this.reActiveInfinite.enable(false);
    }
  }

  // view trip detail
  viewDetail(id) {
    this.navCtrl.push(TripDetailPage, { id: id });
  }

  showMap() {
    this.navCtrl.push(SearchLocationPage);
  }
  viewofferonMap(id) {
    this.navCtrl.push(SearchLocationPage, { id: id });
  }
}
