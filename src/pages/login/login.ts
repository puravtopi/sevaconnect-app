import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  ToastController,
  MenuController,
  Events
} from "ionic-angular";
import { UpdateDetailsPage } from "../update-details/update-details";
import { Storage } from "@ionic/storage";
import { RegisterPage } from "../register/register";
import { RegOrgBoPage } from "../reg-org-bo/reg-org-bo";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";
import { CommonServicesProvider } from "../../providers/common-services/common-services";
import { ActionSheetController, LoadingController } from "ionic-angular";
import { TripsPage } from "../trips/trips";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  responseData: any;
  userData: any;
  status: any;
  loginid: "1";
  pinCode: "";
  passwordType: string = "password";
  passwordIcon: string = "eye-off";
  public loginData: any = { uname: "", pass: "", lid: "1" };
  passwordCheckbox: boolean;

  constructor(
    public nav: NavController,
    public forgotCtrl: AlertController,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public authServicesProvider: AuthenticationServicesProvider,
    public commonServicesProvider: CommonServicesProvider,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public events: Events
  ) {
    this.menu.swipeEnable(false);
    this.loginData.lid = "1";
  }

  // go to register page
  register() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Sign Up Option",
      buttons: [
        {
          text: "Sign Up as Consumer",

          handler: () => {
            console.log("Destructive clicked");
            this.nav.setRoot(RegisterPage, { typeid: 1 });
          }
        },
        {
          text: "Sign Up as Merchant",
          handler: () => {
            this.nav.setRoot(RegOrgBoPage, { typeid: 2 });
          }
        },
        {
          text: "Sign Up as Organization",
          handler: () => {
            this.nav.setRoot(RegOrgBoPage, { typeid: 2 });
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "btncancel",

          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

  // login and go to home page
  login() {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });

    loader.present();

    console.log(JSON.stringify(this.loginData));

    this.authServicesProvider
      .loginServices(
        this.loginData.uname,
        this.loginData.pass,
        this.loginData.lid
      )
      .then(result => {
        this.responseData = result;
        this.status = this.responseData.Status;

        if (this.status == "Success") {
          this.userData = this.responseData.LoginData;
          this.pinCode = this.responseData.PinCode;

          sessionStorage.setItem("uType", this.loginData.lid);
          sessionStorage.setItem("uData", JSON.stringify(this.userData[0]));

          sessionStorage.setItem("pinCode", this.pinCode);

          this.storage.set("uType", this.loginData.lid);
          this.storage.set("uData", JSON.stringify(this.userData[0]));
          this.storage.set("pinCode", this.pinCode);

          if (
            this.userData[0].int_city_id == null ||
            this.userData[0].int_city_id == ""
          )
            this.nav.setRoot(UpdateDetailsPage);
          else this.nav.setRoot(TripsPage);
          //this.nav.setRoot(TestPage);
        } else {
          loader.dismiss();
          this.commonServicesProvider.alertMessage(
            "Seva Connect",
            "Sorry ! Invalid Login."
          );
        }
        loader.dismiss();
      });
    setTimeout(() => {
      this.events.publish("user:login");
    }, 500);
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: "Forgot Password?",
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: "femail",
          placeholder: "Email",
          type: "email"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Send",
          handler: data => {
            console.log("Send clicked");
            let loader = this.loadingCtrl.create({
              content: "Please Wait..."
            });

            loader.present();
            this.authServicesProvider
              .forgotPasswordServices(data.femail, this.loginData.lid)
              .then(result => {
                this.responseData = result;
                this.status = this.responseData.Status;

                if (this.status == "Success") {
                  let toast = this.toastCtrl.create({
                    message: "Email was sended successfully",
                    duration: 3000,
                    position: "top",
                    cssClass: "dark-trans",
                    closeButtonText: "OK",
                    showCloseButton: true
                  });
                  toast.present();
                } else {
                  let toast = this.toastCtrl.create({
                    message: "Sorry!!We did not find this Email in our system.",
                    duration: 3000,
                    position: "top",
                    cssClass: "dark-trans",
                    closeButtonText: "OK",
                    showCloseButton: true
                  });
                  toast.present();
                }
              });

            loader.dismiss();
          }
        }
      ]
    });
    forgot.present();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }
}
