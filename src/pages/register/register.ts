import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { LoginPage } from "../login/login";

import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { CommonServicesProvider } from "../../providers/common-services/common-services";
import { AlertController, NavParams } from "ionic-angular";

@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  users = {
    name: "",
    email: "",
    pass: ""
  };

  userData: any;
  typeid: any;
  responseData: any;
  isInvalid: boolean = false;
  nameReq: boolean = false;
  emailReq: boolean = false;
  passReq: boolean = false;

  public signuptab = "personal";

  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider,
    public commonServicesProvider: CommonServicesProvider,
    public alertCtrl: AlertController
  ) {
    this.typeid = navParams.get("typeid");
  }

  // register and go to home page
  register() {
    //check validation
    this.checkValidation();

    if (!this.isInvalid) {
      this.authServicesProvider
        .consumenrSignUPServices(
          this.users.name,
          this.users.email,
          this.users.pass,
          this.typeid
        )
        .then(result => {
          this.responseData = result;
          let status = this.responseData.Status;
          if (status == "success") {
            this.userData = this.responseData.UserData;
            //this.commonServicesProvider.alertMessage("SevaConnect","Congratulation !! your are registered successfully.")

            let alert = this.alertCtrl.create({
              title: "Seva Connect",
              message:
                'Congratulation !! your are registered successfully.Click "OK" for Login.',
              buttons: [
                {
                  text: "OK",
                  handler: () => {
                    this.login();
                  }
                }
              ]
            });
            alert.present();
          } else {
            this.commonServicesProvider.alertMessage(
              "Seva Connect",
              "Sorry !! there was an issue to create your account."
            );
          }
        });
    }

    //this.nav.setRoot(HomePage);
  }

  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }

  checkValidation() {
    this.isInvalid = false;
    this.passReq = false;
    this.nameReq = false;
    this.emailReq = false;

    if (this.users.name == "" || this.users.name === undefined) {
      this.isInvalid = true;
      this.nameReq = true;
    }

    if (this.users.pass == "" || this.users.pass === undefined) {
      this.isInvalid = true;
      this.passReq = true;
    }

    if (this.users.email == "" || this.users.email === undefined) {
      this.isInvalid = true;
      this.emailReq = true;
    }
  }
}
