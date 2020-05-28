import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { CommonServicesProvider } from "../../providers/common-services/common-services";

/**
 * Generated class for the OrgProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-org-profile",
  templateUrl: "org-profile.html"
})
export class OrgProfilePage {
  public responseData: any;
  public resultData: any;
  public cityData: any;
  public stateData: any;
  public profileData = {
    orgid: 0,
    name: "",
    crop_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    stateid: 0,
    cityid: 0
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider,
    public commonServicesProvider: CommonServicesProvider
  ) {
    this.getProfileData();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OrgProfilePage");
  }

  getProfileData() {
    let userData = JSON.parse(sessionStorage.getItem("uData"));

    this.authServicesProvider
      .getOrgnizationProfileServices(userData.int_organization_id)
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;

        debugger;
        if (status == "Success") {
          this.resultData = this.responseData.OrgnizationData;
          this.profileData.orgid = this.resultData[0].int_organization_id;
          this.profileData.name = this.resultData[0].str_organization_name;
          this.profileData.city = this.resultData[0].str_city_name;
          this.profileData.state = this.resultData[0].str_state_name;
          this.profileData.address = this.resultData[0].str_street_address;
          this.profileData.crop_name = this.resultData[0].str_corporate_name;
          this.profileData.zip = this.resultData[0].int_zip_code;
          this.profileData.stateid = this.resultData[0].int_state_id;
          this.profileData.cityid = this.resultData[0].int_city_id;

          this.getStateData();
          this.getCityData(this.profileData.stateid);
        }
      });
  }

  getStateData() {
    this.authServicesProvider.getAllStateServices().then(result => {
      this.responseData = result;

      let status = this.responseData.Status;
      debugger;
      if (status == "Success") {
        this.stateData = this.responseData.StateData;
      }
    });
  }

  getCityData(stateid) {
    this.authServicesProvider.getCitiesServices(stateid).then(result => {
      this.responseData = result;

      let status = this.responseData.Status;
      debugger;
      if (status == "Success") {
        this.cityData = this.responseData.CityData;
      }
    });
  }
  onChange() {
    this.getCityData(this.profileData.stateid);
  }

  update() {
    alert(this.profileData.orgid);

    this.authServicesProvider
      .updateOrgProfile(
        this.profileData.orgid,
        this.profileData.address,
        this.profileData.cityid,
        this.profileData.stateid,
        this.profileData.zip,
        this.profileData.name,
        this.profileData.crop_name
      )
      .then(result => {
        this.responseData = result;

        let status = this.responseData.Status;
        debugger;
        if (status == "Success") {
          this.commonServicesProvider.alertMessage(
            "SevaConnect",
            "Profile Updated Successfully."
          );
          this.getProfileData();
        }
      });
  }
}
