import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { TripsPage } from "../trips/trips";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { CommonServicesProvider } from "../../providers/common-services/common-services";

import { Storage } from "@ionic/storage";

/**
 * Generated class for the UpdateDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-update-details",
  templateUrl: "update-details.html"
})
export class UpdateDetailsPage {
  states: any;
  statesorg: any;
  cities: any;
  citiesorg: any;
  orgType: any;
  loginData: any;
  userData: any;
  orgs: any;
  userId: any;
  status: any;
  pinCode: any;
  users = {
    address: "",
    stateid: 0,
    cityid: 0,
    orgstateid: 0,
    orgcityid: 0,
    zipcode: "",
    orgid: "",
    orgtypeid: 0
  };

  responseData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider,
    public commonServicesProvider: CommonServicesProvider,
    private storage: Storage,
    public events: Events
  ) {
    this.getOrgType();

    this.getAllState().then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.states = this.responseData.StateData;
        this.statesorg = this.responseData.StateData;
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

    this.userId = this.navParams.get("id");
    this.loginData = this.navParams.get("loginData");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UpdateDetailsPage");
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

    if (stateId != 0) cnd = cnd + " and int_state_id=" + stateId;
    if (cityId != 0) cnd = cnd + " and int_city_id=" + cityId;
    if (orgtype != 0) cnd = cnd + " and int_organization_type_id=" + orgtype;

    this.authServicesProvider.getOrgServices(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "Success") {
        this.orgs = this.responseData.OrgData;
      }
    });
  }

  updateDetails() {
    this.authServicesProvider
      .updateDetailsServices(
        this.userId,
        this.users.address,
        this.users.stateid,
        this.users.cityid,
        this.users.zipcode,
        this.users.orgid
      )
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;
        if (status == "success") {
          this.commonServicesProvider.alertMessage(
            "Seva Connect",
            "Thanks for providing details."
          );

          this.authServicesProvider
            .loginServices(
              this.loginData.uname,
              this.loginData.pass,
              this.loginData.lid
            )
            .then(result => {
              this.responseData = result;
              this.status = this.responseData.Status;

              this.userData = this.responseData.LoginData;
              this.pinCode = this.responseData.PinCode;

              if (this.status == "Success") {
                sessionStorage.setItem("uType", this.loginData.lid);
                sessionStorage.setItem(
                  "uData",
                  JSON.stringify(this.userData[0])
                );

                sessionStorage.setItem("pinCode", this.pinCode);

                this.storage.set("uType", this.loginData.lid);
                this.storage.set("uData", JSON.stringify(this.userData[0]));
                this.storage.set("pinCode", this.pinCode);

                this.navCtrl.setRoot(TripsPage);

                //this.nav.setRoot(TestPage);
              }
            });
          setTimeout(() => {
            this.events.publish("user:login");
          }, 500);

          this.navCtrl.setRoot(TripsPage);
        }
      });
  }
}
