import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Searchbar
} from "ionic-angular";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { TripDetailPage } from "../trip-detail/trip-detail";
import { SearchLocationPage } from "../search-location/search-location";
/**
 * Generated class for the TripSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-trip-search",
  templateUrl: "trip-search.html"
})
export class TripSearchPage {
  public catId: any;
  public subcatData: string = "";
  public searchText: any;
  responseData: any;
  userData: any;
  public search = { subcatid: "0", distance: "0", price: "0", sort: "0" };
  public distance = ["0-100", "100-200", "200-500", "500+"];
  public price = ["0-100", "100-200", "200-500", "500+"];
  public sort = ["Title", "Price", "Distance"];

  public offers: any;
  public todayDate: Date = new Date();
  pageIdex = 1;
  totalCount = 0;
  cnd: any;
  priceRange = 0;
  subcatId = 0;
  offerOption = "0";
  reActiveInfinite: any;

  @ViewChild("searchbar") searchbar: Searchbar;

  constructor(
    public navCtrl: NavController,
    public nav: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider,
    public loadingCtrl: LoadingController
  ) {
    this.catId = this.navParams.data;

    this.cnd = " where int_category_id=" + this.catId;
    this.getOffers(this.cnd);
    this.getSubCat(this.catId);
  }

  onChange() {
    if (this.reActiveInfinite !== null && this.reActiveInfinite !== undefined)
      this.reActiveInfinite.enable(true);

    let scnd = "";

    if (this.search.subcatid !== "0") {
      if (scnd != "")
        scnd = scnd + " and int_sub_category_id=" + this.search.subcatid;
      else scnd = " and int_sub_category_id=" + this.search.subcatid;
    }

    if (this.search.price !== "0") {
      if (scnd != "") {
        if (this.search.price !== "500+")
          scnd =
            scnd +
            " and  discountprice between " +
            this.search.price.split("-")[0] +
            " and " +
            this.search.price.split("-")[1];
        else scnd = scnd + " and discountprice>500";
      } else {
        if (this.search.price !== "500+")
          scnd =
            " and discountprice between " +
            this.search.price.split("-")[0] +
            " and " +
            this.search.price.split("-")[1];
        else scnd = " and discountprice>500";
      }
    }

    this.cnd = " where int_category_id=" + this.catId + " " + scnd;

    this.offers = null;
    this.pageIdex = 1;

    this.getOffers(this.cnd);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TripSearchPage");
  }

  getOffers(cnd, infiniteScroll?) {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });

    if (this.searchText !== "" && this.searchText !== undefined) {
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
      .getOffersServices(cnd, this.pageIdex, 5, "desc", "bit_is_treading")
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

  getSubCat(catId) {
    let cnd = " where int_category_id=" + catId;

    this.authServicesProvider.getSubCatServices(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.subcatData = this.responseData.SubCatData;
      }
    });
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
    this.nav.push(TripDetailPage, { id: id });
  }

  showMap() {
    this.nav.push(SearchLocationPage);
  }

  onsearchChange() {
    if (this.searchText !== "") {
      if (this.searchText.length > 2) {
        this.offers = null;

        this.pageIdex = 1;
        this.getOffers(this.cnd);
        setTimeout(() => {
          this.searchbar.setFocus();
        }, 600);
      }
    }
  }
  onCancel() {
    this.searchText = "";
    this.offers = null;

    this.pageIdex = 1;

    this.getOffers(this.cnd);
  }
}
