import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TripsPage } from "../trips/trips";
import { AuthenticationServicesProvider } from '../../providers/authentication-services/authentication-services';
import { CommonServicesProvider } from '../../providers/common-services/common-services';

/**
 * Generated class for the UpdateDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-details',
  templateUrl: 'update-details.html',
})
export class UpdateDetailsPage {

  states: any;
  cities: any;
  citiesorg: any;
  orgType: any;
  orgs: any;
  userData: any;
  users = {
    address: "", stateid: "", cityid: "", orgstateid: 0, orgcityid: 0, zipcode: "", orgid: "", orgtypeid: 0
  }

  responseData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authServicesProvider: AuthenticationServicesProvider,
  public commonServicesProvider: CommonServicesProvider,) {

    this.getOrgType();

    this.getAllState().then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.states = this.responseData.StateData;
      }
    });

    this.getCities("").then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.cities = this.responseData.CityData;
        this.citiesorg = this.responseData.CityData;
      }
    });

    this.userData = JSON.parse(sessionStorage.getItem('uData'));

   

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateDetailsPage');
  }

  getAllState() {
    return this.authServicesProvider.getAllStateServices();
  }

  getCities(stateid) {
    return this.authServicesProvider.getCitiesServices(stateid);
  }

  public onStateChange(selectedValue: any) {
    this.getCities(selectedValue).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.cities = this.responseData.CityData;
      }
    });
  }

  getOrgType() {

    this.authServicesProvider.getOrgTypeServices("").then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.orgType = this.responseData.OrgTypeData;
      }
    });
  }
  public onOrgStateChange(selectedValue: any) {


    this.getCities(selectedValue).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.citiesorg = this.responseData.CityData;
        this.getOrganization();
      }
    });
  }

  public onChange() {
    this.getOrganization();
  }

  getOrganization() {

    let stateId = this.users.orgstateid;
    let cityId = this.users.orgcityid;
    let orgtype = this.users.orgtypeid;
    let cnd = " where 1=1";

    if (stateId != 0)
      cnd = cnd + " and int_state_id=" + stateId;
    if (cityId != 0)
      cnd = cnd + " and int_city_id=" + cityId;
    if (orgtype != 0)
      cnd = cnd + " and int_organization_type_id=" + orgtype;


    this.authServicesProvider.getOrgServices(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.orgs = this.responseData.OrgData;
      }
    });
  }


  updateDetails() {
    this.authServicesProvider.updateDetailsServices(this.userData.int_user_id, this.users.address, this.users.stateid, this.users.cityid, this.users.zipcode, this.users.orgid).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "success") {
        this.commonServicesProvider.alertMessage("Seva Connect","Thanks for providing details.");
        this.navCtrl.setRoot(TripsPage);
      }
    });
  }


}
