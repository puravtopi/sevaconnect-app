import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { TripsPage } from "../trips/trips";
import { FormControl } from "@angular/forms";
import { TripDetailPage } from "../trip-detail/trip-detail";

import {
  Geolocation,
  GeolocationOptions,
  Geoposition
} from "@ionic-native/geolocation";

// import {SearchCarsPage} from "../search-cars/search-cars";

@Component({
  selector: "page-search-location",
  templateUrl: "search-location.html"
})
export class SearchLocationPage {
  public catId: any;
  public offers: any;
  public subcatData: any;
  responseData: any;
  public cnd = "";
  public latitude: any;
  public longitude: any;
  public location: any;
  public searchControl: FormControl;
  public zoom: number;
  public rate = 5;
  options: GeolocationOptions;
  currentPos: Geoposition;

  @ViewChild("search")
  public searchElementRef;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems = [];

  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation
  ) {
    if (this.navParams.get("id") !== undefined)
      this.cnd = " where int_offer_id=" + this.navParams.get("id");
    else this.cnd = "";

    this.zoom = 4;

    //create search FormControl
    this.searchControl = new FormControl();

    this.catId = this.navParams.data;
    this.getSubCat(this.catId);

    //set current position
    //   this.setCurrentPosition();
    this.getOffers(this.cnd);
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

  ionViewDidLoad() {
    this.zoom = 12;
    this.searchControl = new FormControl();
  }

  // search by item
  searchBy(item) {
    this.nav.push(TripsPage, {
      subCatId: item.int_sub_category_id,
      catId: this.catId
    });
  }

  private setCurrentPosition() {
    this.options = {
      enableHighAccuracy: true
    };

    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
      })
      .catch(error => {
        console.log("Error getting location", error);
      });

    // this.geolocation.getCurrentPosition(this.options).then(
    //   (pos: Geoposition) => {
    //     if (this.cnd !== "") {
    //       pos.coords.latitude = this.latitude;
    //       pos.coords.longitude = this.longitude;
    //     }

    //     this.currentPos = pos;

    //     alert(this.currentPos);
    //     console.log(pos);

    //     this.latitude = pos.coords.latitude;
    //     this.longitude = pos.coords.longitude;

    //     //this.addMap(pos.coords.latitude, pos.coords.longitude);
    //   },
    //   (err: PositionError) => {
    //     alert("error : " + err.message);
    //   }
    // );
  }

  private getOffers(query) {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });

    loader.present();

    this.authServicesProvider
      .getOffersServices(query, 1, 0, "asc", "int_offer_id")
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;
        if (status == "Success") {
          this.offers =
            this.offers != null
              ? this.offers.concat(this.responseData.OffersData)
              : this.responseData.OffersData;
          var flags = [],
            output = [],
            offersInfo = [],
            l = this.offers.length,
            i,
            j,
            ts = this;
          for (i = 0; i < l; i++) {
            if (flags[this.offers[i].int_retailer_id]) continue;
            flags[this.offers[i].int_retailer_id] = true;
            for (j = 0; j < l; j++) {
              if (ts.offers[j].int_retailer_id == ts.offers[i].int_retailer_id)
                offersInfo.push({
                  str_img: ts.offers[j].str_img,
                  int_offer_id: ts.offers[j].int_offer_id,
                  str_offer_name: ts.offers[j].str_offer_name,
                  str_category_name: ts.offers[j].str_category_name,
                  str_sub_category_name: ts.offers[j].str_sub_category_name,
                  rate: ts.offers[j].rate
                });
            }
            output.push({
              str_corporate_name: this.offers[i].str_retailer_name,
              str_street_address: this.offers[i].str_street_address,
              int_zip_code: this.offers[i].int_zip_code,
              str_city_name: this.offers[i].str_city_name,
              str_state_name: this.offers[i].str_state_name,
              lat: parseFloat(this.offers[i].str_latitude),
              long: parseFloat(this.offers[i].str_langitude),
              offers: JSON.parse(JSON.stringify(offersInfo))
            });

            if (query !== "") {
              this.latitude = parseFloat(this.offers[i].str_latitude);
              this.longitude = parseFloat(this.offers[i].str_langitude);
            } else this.setCurrentPosition();
          }
          this.location = JSON.parse(JSON.stringify(output));

          console.log(JSON.stringify(output));
        }
      });

    loader.dismiss();
  }

  // view trip detail
  viewDetail(id) {
    this.nav.push(TripDetailPage, { id: id });
  }
}
