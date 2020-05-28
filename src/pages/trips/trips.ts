import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  LoadingController,
  Events,
  Searchbar
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { TripService } from "../../services/trip-service";
import { TripDetailPage } from "../trip-detail/trip-detail";
import { DealDetailsPage } from "../deal-details/deal-details";
import { FeatDealDetailsPage } from "../feat-deal-details/feat-deal-details";
import { SearchCouponsPage } from "../search-coupons/search-coupons";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { SearchLocationPage } from "../search-location/search-location";
import { TripSearchPage } from "../trip-search/trip-search";
import { DatePipe } from "@angular/common";

@Component({
  selector: "page-trips",
  templateUrl: "trips.html"
})
export class TripsPage {
  // list of offers
  public offers: any;
  public deals: any;
  public f_deals: any;
  public todayDate: Date = new Date();
  searchText: any = "";
  pageIdex = 1;
  totalCount = 0;
  responseData: any;
  priceRange = 0;
  subcatId = 0;
  catId = 0;
  offerOption = "0";
  reActiveInfinite: any;
  pin = "";
  public uType: any = "0";

  @ViewChild("searchbar") searchbar: Searchbar;

  constructor(
    public nav: NavController,
    public tripService: TripService,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public events: Events,
    private storage: Storage,
    public datepipe: DatePipe
  ) {
    if (this.navParams.get("subCatId") != undefined)
      this.catId = this.navParams.get("catId");

    let ts = this;
    debugger;
    this.storage.get("uType").then(val => {
      if (val != null) {
        if (val === "3") {
          this.storage.get("uData").then(dateval => {
            let userData = JSON.parse(dateval);

            ts.authServicesProvider
              .getRetailerPin(userData.int_retailer_id)
              .then(result => {
                ts.responseData = result;

                if (ts.responseData.Status == "Success") {
                  ts.storage.set("pinCode", ts.responseData.PinCode);

                  console.log(this.responseData.PinCode);
                }
              });
          });
        } else ts.storage.set("pinCode", "0");

        ts.events.publish("user:login");
      }
    });

    this.getOffers();
  }

  getOffers(infiniteScroll?) {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });

    let cnd = " where 1=1";

    if (this.navParams.get("subCatId") != undefined)
      this.subcatId = this.navParams.get("subCatId");

    if (this.subcatId > 0) cnd += " and int_sub_category_id=" + this.subcatId;

    if (this.offerOption === "2") cnd += " and  bit_is_treading='True'";

    if (this.searchText !== "") {
      let query = "";
      if (this.searchText.length > 2) {
        query += " and (str_retailer_name like '%" + this.searchText + "%' ";
        query += " or str_offer_name like '%" + this.searchText + "%' ";
        query += " or str_offer_details like '%" + this.searchText + "%' ";
        query += " or str_category_name like '%" + this.searchText + "%' ";
        query += " or str_sub_category_name like '%" + this.searchText + "%' ";
        query += " or str_city_name like '%" + this.searchText + "%' ";
        query += " or str_state_name like '%" + this.searchText + "%' ";
        query += " or str_street_address like '%" + this.searchText + "%') ";

        cnd += query;
      }
    }

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
        // debugger;
        // console.log(JSON.stringify(this.offers));
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      });

    loader.dismiss();
  }

  getDailyDeals(infiniteScroll?) {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });

    let today = new Date();
    let s_date = this.datepipe.transform(today, "MM/dd/yyyy");

    let e_date = this.datepipe.transform(
      today.setDate(today.getDate() + 5),
      "MM/dd/yyyy"
    );

    let cnd =
      " where date_campaign_date between '" +
      s_date +
      "' and '" +
      e_date +
      "' ";

    if (this.navParams.get("subCatId") != undefined)
      this.subcatId = this.navParams.get("subCatId");

    if (this.subcatId > 0) cnd += " and int_sub_category_id=" + this.subcatId;

    if (this.searchText !== "") {
      let query = "";
      if (this.searchText.length > 2) {
        query += " and (str_retailer_name like '%" + this.searchText + "%' ";
        query += " or str_deal_name like '%" + this.searchText + "%' ";
        query += " or str_deal_details like '%" + this.searchText + "%' ";
        query += " or str_category_name like '%" + this.searchText + "%' ";
        query += " or str_sub_category_name like '%" + this.searchText + "%' ";
        query += " or str_location like '%" + this.searchText + "%') ";

        cnd += query;
      }
    }

    loader.present();

    debugger;

    this.authServicesProvider
      .getDailyDealsServices(cnd, this.pageIdex, 5, "desc", "int_deal_id")
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;
        if (status == "Success") {
          this.deals =
            this.deals != null
              ? this.deals.concat(this.responseData.DealsData)
              : this.responseData.DealsData;
          this.deals = this.deals.map(function(d, i) {
            var diff = Math.abs(
              new Date(d.date_campaign_date).getTime() - new Date().getTime()
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
        // debugger;
        // console.log(JSON.stringify(this.offers));
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      });

    loader.dismiss();
  }

  getFeaturedDailyDeals(infiniteScroll?) {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });

    let cnd = " where 1=1 ";

    if (this.navParams.get("subCatId") != undefined)
      this.subcatId = this.navParams.get("subCatId");

    if (this.subcatId > 0) cnd += " and int_sub_category_id=" + this.subcatId;

    if (this.searchText !== "") {
      let query = "";
      if (this.searchText.length > 2) {
        query += " and (str_retailer_name like '%" + this.searchText + "%' ";
        query += " or str_deal_name like '%" + this.searchText + "%' ";
        query += " or str_deal_details like '%" + this.searchText + "%' ";
        query += " or str_category_name like '%" + this.searchText + "%' ";
        query += " or str_sub_category_name like '%" + this.searchText + "%' ";
        query += " or str_location like '%" + this.searchText + "%') ";

        cnd += query;
      }
    }

    loader.present();

    debugger;

    this.authServicesProvider
      .getFeaturedDealsServices(cnd, this.pageIdex, 5, "desc", "int_deal_id")
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;
        if (status == "Success") {
          this.f_deals =
            this.f_deals != null
              ? this.f_deals.concat(this.responseData.DealsData)
              : this.responseData.DealsData;
          this.f_deals = this.f_deals.map(function(d, i) {
            var diff = Math.abs(
              new Date(d.date_end_date).getTime() - new Date().getTime()
            );
            var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

            d.endDays = diffDays;

            var price = 0.0;
            var purchase_amt = 0.0;

            debugger;
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

        // debugger;
        // console.log(JSON.stringify(this.offers));
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      });

    loader.dismiss();
  }

  loadMore(infiniteScroll) {
    this.reActiveInfinite = infiniteScroll;

    this.pageIdex++;

    if (this.offerOption === "0") this.getOffers(infiniteScroll);
    else if (this.offerOption === "3") this.getDailyDeals(infiniteScroll);

    let pages = 0;
    if (this.totalCount > 0) pages = Math.ceil(this.totalCount / 5);

    if (this.pageIdex === pages) {
      infiniteScroll.enable(false);
    }
  }

  // view trip detail
  viewDetail(id) {
    if (
      this.offerOption === "0" ||
      this.offerOption === "1" ||
      this.offerOption === "2"
    )
      this.nav.push(TripDetailPage, { id: id });
    else if (this.offerOption === "3")
      this.nav.push(DealDetailsPage, { id: id });
    else if (this.offerOption === "4")
      this.nav.push(FeatDealDetailsPage, { id: id });
  }

  filterCoupons() {
    let searchModal = this.modalCtrl.create(SearchCouponsPage, {
      subCatId: this.subcatId,
      catId: this.catId
    });
    searchModal.present();
  }

  showMap() {
    this.nav.push(SearchLocationPage);
  }

  changeSubCategory(catId) {
    this.nav.push(TripSearchPage, catId);
  }

  segmentButtonClicked(ev: any) {
    this.pageIdex = 1;

    this.offerOption = ev.value;

    this.offers = null;
    this.deals = null;
    this.f_deals = null;
    if (
      this.offerOption === "0" ||
      this.offerOption === "2" ||
      this.offerOption === "1"
    ) {
      this.getOffers();
    } else if (this.offerOption === "3") {
      this.getDailyDeals();
    } else if (this.offerOption === "4") {
      this.getFeaturedDailyDeals();
    }

    if (this.reActiveInfinite != "undefined" && this.reActiveInfinite != null) {
      this.reActiveInfinite.enable(true);
    }
  }

  viewofferonMap(id) {
    this.nav.push(SearchLocationPage, { id: id });
  }

  onChange() {
    if (this.searchText !== "") {
      if (this.searchText.length > 2) {
        this.offers = null;
        this.deals = null;
        this.pageIdex = 1;

        if (
          this.offerOption === "0" ||
          this.offerOption === "2" ||
          this.offerOption === "1"
        ) {
          this.getOffers();
        } else if (this.offerOption === "3") this.getDailyDeals();

        setTimeout(() => {
          this.searchbar.setFocus();
        }, 600);
      }
    }
  }
  onCancel() {
    this.searchText = "";
    this.offers = null;
    this.deals = null;

    this.pageIdex = 1;

    this.getOffers();
    this.getDailyDeals();
  }
}
