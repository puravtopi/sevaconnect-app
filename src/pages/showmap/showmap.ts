import { Component, ViewChild, ElementRef } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition,
  PositionError
} from "@ionic-native/geolocation";

/**
 * Generated class for the ShowmapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: "page-showmap",
  templateUrl: "showmap.html"
})
export class ShowmapPage {
  options: GeolocationOptions;
  currentPos: Geoposition;
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  start = "chicago, il";
  end = "chicago, il";
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation
  ) {
    alert("1");
    this.getUserPosition();
  }

  ionViewDidLoad() {
    alert("2");
    this.initMap();
  }

  getUserPosition() {
    this.options = {
      enableHighAccuracy: false
    };
    this.geolocation.getCurrentPosition(this.options).then(
      (pos: Geoposition) => {
        this.currentPos = pos;

        console.log(pos);

        // this.addMap(pos.coords.latitude,pos.coords.longitude);
      },
      (err: PositionError) => {
        console.log("error : " + err.message);
      }
    );
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 }
    });

    this.directionsDisplay.setMap(this.map);
  }

  calculateAndDisplayRoute() {
    this.directionsService.route(
      {
        origin: this.start,
        destination: this.end,
        travelMode: "DRIVING"
      },
      (response, status) => {
        if (status === "OK") {
          this.directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}
