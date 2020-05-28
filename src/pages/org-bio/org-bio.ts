import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";

/**
 * Generated class for the OrgBioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-org-bio",
  templateUrl: "org-bio.html"
})
export class OrgBioPage {
  responseData: any;
  public resultData: any;
  public is_edit: Boolean;
  bio_details: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider
  ) {
    this.getBioData();
    this.is_edit = false;
    this.bio_details = "";
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OrgBioPage");
  }

  getBioData() {
    let userData = JSON.parse(sessionStorage.getItem("uData"));

    this.authServicesProvider
      .getOrgBio(userData.int_organization_id)
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;

        debugger;
        if (status == "Success") {
          this.resultData = this.responseData.BioData;
          this.bio_details = this.resultData[0].str_company_bio;
        }
      });
  }

  edit() {
    this.is_edit = true;
  }

  saveBio() {
    let userData = JSON.parse(sessionStorage.getItem("uData"));
    this.authServicesProvider
      .updateOrgBio(userData.int_organization_id, this.bio_details)
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;

        debugger;
        if (status == "Success") {
          this.getBioData();
          this.is_edit = false;
        }
      });
  }

  cancel() {
    this.is_edit = false;
  }
}
