import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";

/**
 * Generated class for the RetBioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-ret-bio",
  templateUrl: "ret-bio.html"
})
export class RetBioPage {
  responseData: any;
  public resultData: any;
  public is_edit: Boolean;
  bio_details: any = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider
  ) {
    this.getBioData();
    this.is_edit = false;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OrgBioPage");
  }

  getBioData() {
    let userData = JSON.parse(sessionStorage.getItem("uData"));

    this.authServicesProvider
      .getRetBio(userData.int_retailer_id)
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;

        debugger;
        if (status == "Success") {
          this.resultData = this.responseData.BioData;
          this.bio_details = this.resultData[0].str_company_bio;
        } else {
          this.bio_details = "";
        }
      });
  }

  edit() {
    this.is_edit = true;
  }

  saveBio() {
    let userData = JSON.parse(sessionStorage.getItem("uData"));
    this.authServicesProvider
      .updateRetBio(userData.int_retailer_id, this.bio_details)
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
