import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";

/**
 * Generated class for the RegOrgBoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-reg-org-bo",
  templateUrl: "reg-org-bo.html"
})
export class RegOrgBoPage {
  constructor(public nav: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegOrgBoPage");
  }
  back() {
    this.nav.setRoot(LoginPage);
  }
}
