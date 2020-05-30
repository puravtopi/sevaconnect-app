import { NgModule } from "@angular/core";
import { IonicApp, IonicModule } from "ionic-angular";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { TooltipsModule } from "ionic-tooltips";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";
import { AgmCoreModule } from "@agm/core";
import { DatePipe } from "@angular/common";

import { ActivityService } from "../services/activity-service";
import { TripService } from "../services/trip-service";
import { WeatherProvider } from "../services/weather";

import { MyApp } from "./app.component";

import { SettingsPage } from "../pages/settings/settings";
import { TripSearchPage } from "../pages/trip-search/trip-search";
import { CheckoutTripPage } from "../pages/checkout-trip/checkout-trip";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { NotificationsPage } from "../pages/notifications/notifications";
import { RegisterPage } from "../pages/register/register";
import { SearchLocationPage } from "../pages/search-location/search-location";
import { TripDetailPage } from "../pages/trip-detail/trip-detail";
import { OrgBioPage } from "../pages/org-bio/org-bio";
import { OrgProfilePage } from "../pages/org-profile/org-profile";
import { RetBioPage } from "../pages/ret-bio/ret-bio";
import { RetProfilePage } from "../pages/ret-profile/ret-profile";
import { RetOffersPage } from "../pages/ret-offers/ret-offers";
import { RetStatisticsPage } from "../pages/ret-statistics/ret-statistics";
import { MemStatisticsPage } from "../pages/mem-statistics/mem-statistics";
import { RegOrgBoPage } from "../pages/reg-org-bo/reg-org-bo";
import { TripsPage } from "../pages/trips/trips";
import { DealDetailsPage } from "../pages/deal-details/deal-details";
import { FeatDealDetailsPage } from "../pages/feat-deal-details/feat-deal-details";
import { LocalWeatherPage } from "../pages/local-weather/local-weather";
import { HttpModule } from "@angular/http";
import { UpdateDetailsPage } from "../pages/update-details/update-details";
import { ShowmapPage } from "../pages/showmap/showmap";
import { SearchCouponsPage } from "../pages/search-coupons/search-coupons";
import { TransactionhistoryPage } from "../pages/transactionhistory/transactionhistory";
import { AuthenticationServicesProvider } from "../providers/authentication-services/authentication-services";
import { CommonServicesProvider } from "../providers/common-services/common-services";
import { Ionic2RatingModule } from "ionic2-rating";
import { Geolocation } from "@ionic-native/geolocation";
import { SafeHtmlPipe } from "../pipes/safe-html/safe-html";

import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";

// import services
// end import services
// end import services

// import pages
// end import pages

@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    CheckoutTripPage,
    HomePage,
    LoginPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    TripsPage,
    RetOffersPage,
    OrgProfilePage,
    OrgBioPage,
    RetBioPage,
    RetProfilePage,
    UpdateDetailsPage,
    SearchCouponsPage,
    ShowmapPage,
    TransactionhistoryPage,
    TripSearchPage,
    SafeHtmlPipe,
    RetStatisticsPage,
    MemStatisticsPage,
    DealDetailsPage,
    FeatDealDetailsPage,
    RegOrgBoPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    TooltipsModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          statusbarPadding: true,
          scrollAssist: true,
          autoFocusAssist: true,
          scrollPadding: true
        },
        android: {
          scrollPadding: false,
          scrollAssist: true,
          autoFocusAssist: false
        }
      }
    }),
    IonicStorageModule.forRoot({
      name: "__ionic3_start_theme",
      driverOrder: ["indexeddb", "sqlite", "websql"]
    }),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw",
      libraries: ["places"]
    }),
    AgmSnazzyInfoWindowModule,
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    CheckoutTripPage,
    HomePage,
    LoginPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    TripsPage,
    RetBioPage,
    OrgBioPage,
    OrgProfilePage,
    RetProfilePage,
    UpdateDetailsPage,
    SearchCouponsPage,
    ShowmapPage,
    TransactionhistoryPage,
    RetOffersPage,
    TripSearchPage,
    RetStatisticsPage,
    MemStatisticsPage,
    DealDetailsPage,
    FeatDealDetailsPage,
    RegOrgBoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    ActivityService,
    TripService,
    WeatherProvider,
    AuthenticationServicesProvider,
    CommonServicesProvider,
    DatePipe,
    Geolocation
  ]
})
export class AppModule {}
