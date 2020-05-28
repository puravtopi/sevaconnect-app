import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationServicesProvider } from '../../providers/authentication-services/authentication-services';
import { TripsPage } from "../trips/trips";
/**
 * Generated class for the SearchCouponsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-coupons',
  templateUrl: 'search-coupons.html',
})
export class SearchCouponsPage {

  public filter = { priceRange: 0, catid: 0, subcatid: 0 };
  cats: any;
  subcats: any;
  responseData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authServicesProvider: AuthenticationServicesProvider) {
    this.filter.catid = this.navParams.get('catId');
    this.filter.subcatid = this.navParams.get('subCatId');

    this.getCategory();
    this.getSubCat(this.filter.catid);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchCouponsPage');
  }

  getCategory() {
    this.authServicesProvider.getCatServices().then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.cats = this.responseData.CategoryData;
      }
    });
  }

  getSubCat(catId) {
    let cnd = catId != "0" ? " where int_category_id=" + catId : "";

    this.authServicesProvider.getSubCatServices(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.subcats = this.responseData.SubCatData;
      
      }
    });

  }

  public onCategoryChange(selectedValue: any) {
    if (selectedValue != "0") {
      this.getSubCat(selectedValue)
      this.filter.subcatid = this.subcats[0].int_sub_category_id;
    }
    else {
      this.getSubCat("0")
    }
  }

  searchCoupon() {
    this.navCtrl.push(TripsPage, { subCatId: this.filter.subcatid, catId: this.filter.catid });
  }
  back()
  {
    this.navCtrl.pop();
  }


}
