import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, Events, AlertController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";
import { Storage } from "@ionic/storage";
import { TripsPage } from "../pages/trips/trips";
import { LoginPage } from "../pages/login/login";
import { TransactionhistoryPage } from "../pages/transactionhistory/transactionhistory";

import { OrgBioPage } from "../pages/org-bio/org-bio";
import { RetBioPage } from "../pages/ret-bio/ret-bio";
import { RetProfilePage } from "../pages/ret-profile/ret-profile";
import { OrgProfilePage } from "../pages/org-profile/org-profile";
import { RetOffersPage } from "../pages/ret-offers/ret-offers";
import { RetStatisticsPage } from "../pages/ret-statistics/ret-statistics";
import { MemStatisticsPage } from "../pages/mem-statistics/mem-statistics";

export interface MenuItem {
  title: string;
  component: any;
  icon: string;
}

declare var navigator: any;

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  appMenuItems: Array<MenuItem>;
  userData: any;
  userFullName: any;
  userImg: any;
  userType: any;
  userTypeId: any;
  pinCode: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public keyboard: Keyboard,
    public events: Events,
    public alertCtrl: AlertController,
    private storage: Storage
  ) {
    events.subscribe("user:login", () => {
      this.loggedIn();
    });

    this.initializeApp();

    this.appMenuItems = [
      { title: "Home", component: TripsPage, icon: "home" },
      {
        title: "My History",
        component: TransactionhistoryPage,
        icon: "partly-sunny"
      }
    ];
  }

  loggedIn() {
    debugger;

    let ts = this;

    this.storage.get("uData").then(val => {
      if (val != null) {
        ts.userData = val;

        ts.storage.get("uType").then(typeval => {
          if (typeval != null) {
            ts.userType = typeval;
            ts.userTypeId = typeval;
            let tempUserData = JSON.parse(this.userData);
            console.log("User Details:" + tempUserData);

            // 1 for Customer
            if (typeval === "1") {
              ts.userFullName =
                tempUserData.str_first_name + " " + tempUserData.str_last_name;
              ts.userType = "Customer";

              ts.appMenuItems = [
                { title: "Home", component: TripsPage, icon: "home" },
                {
                  title: "My History",
                  component: TransactionhistoryPage,
                  icon: "briefcase"
                },
                {
                  title: "Statistics",
                  component: MemStatisticsPage,
                  icon: "podium"
                }
              ];
            } else if (typeval === "2") {
              ts.userFullName = tempUserData.str_organization_name;
              ts.userType = "Organization";

              ts.appMenuItems = [
                { title: "Home", component: TripsPage, icon: "home" },
                {
                  title: "My Bio",
                  component: OrgBioPage,
                  icon: "person"
                },
                {
                  title: "My Profile",
                  component: OrgProfilePage,
                  icon: "person"
                }
              ];
            } else if (typeval === "3") {
              ts.userFullName = tempUserData.str_retailer_name;
              ts.userType = "Business Owner";

              ts.storage.get("pinCode").then(pinval => {
                console.log("Pincode:" + pinval);
                if (pinval != null) ts.pinCode = pinval;
              });

              ts.appMenuItems = [
                { title: "Home", component: TripsPage, icon: "home" },
                {
                  title: "My Bio",
                  component: RetBioPage,
                  icon: "person"
                },
                {
                  title: "My Profile",
                  component: RetProfilePage,
                  icon: "person"
                },
                {
                  title: "My Coupons",
                  component: RetOffersPage,
                  icon: "pricetags"
                },
                {
                  title: "Statistics",
                  component: RetStatisticsPage,
                  icon: "podium"
                }
              ];
            }

            ts.userImg = tempUserData.str_logo_img;
          }
        });
      }
    });
  }

  initializeApp() {
    let ts = this;

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.

      //*** Control Splash Screen
      // this.splashScreen.show();
      // this.splashScreen.hide();

      var networkState = navigator.connection.type;

      if (networkState === "none") {
        let alert = this.alertCtrl.create({
          title: "Network was disconnected :-(",
          subTitle: "Please check your connection. And try again",
          buttons: ["OK"]
        });
        alert.present();
      } else {
        ts.storage.get("uData").then(val => {
          if (val != null) {
            ts.rootPage = TripsPage;
            ts.userData = val;
            ts.storage.get("uType").then(typeval => {
              if (typeval != null) {
                let tempUserData = JSON.parse(ts.userData);
                if (typeval === "1") {
                  ts.userFullName =
                    tempUserData.str_first_name +
                    " " +
                    tempUserData.str_last_name;
                } else if (typeval === "2") {
                  ts.userFullName = tempUserData.str_organization_name;
                } else if (typeval === "3") {
                  ts.userFullName = tempUserData.str_retailer_name;
                }
                sessionStorage.setItem("uType", typeval);
              }
            });

            sessionStorage.setItem("uData", this.userData);
          } else {
            ts.rootPage = LoginPage;
          }
        });

        // debugger;

        // if (this.userData != null) {
        //   let uType = this.userType;

        //   let tempUserData = JSON.parse(this.userData);
        //   if (uType === "1") {
        //     this.userFullName =
        //       tempUserData.str_first_name + " " + tempUserData.str_last_name;
        //   } else if (uType === "2") {
        //     this.userFullName = tempUserData.str_organization_name;
        //   } else if (uType === "3") {
        //     this.userFullName = tempUserData.str_retailer_name;
        //   }
        // }

        // this.rootPage = this.userData != null ? TripsPage : LoginPage;

        //*** Control Status Bar
        ts.statusBar.styleDefault();
        ts.statusBar.overlaysWebView(false);

        //*** Control Keyboard
        ts.keyboard.disableScroll(true);
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.storage.clear();
    this.nav.setRoot(LoginPage);
  }
}
