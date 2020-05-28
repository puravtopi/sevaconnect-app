import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Chart } from "chart.js";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";

/**
 * Generated class for the MemStatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-mem-statistics",
  templateUrl: "mem-statistics.html"
})
export class MemStatisticsPage implements OnInit {
  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("barCanvasCat") barCanvasCat: ElementRef;
  @ViewChild("barCanvasCatSaving") barCanvasCatSaving: ElementRef;

  public responseData: any;
  public resultData: any;
  public data: any;
  public yearlist: any = [];
  public year: any;
  public total: any = 0;
  private barChart: Chart;
  private barChartCat: Chart;
  private barChartSaving: Chart;
  private uid: any;

  private color: any = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)"
  ];
  private bordercolor: any = [
    "rgba(255,99,132,1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255,99,132,1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)"
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad MemStatisticsPage");
  }

  ngOnInit() {}

  ionViewDidEnter() {
    let d = new Date();

    this.yearlist.push(d.getFullYear());
    this.yearlist.push(d.getFullYear() - 1);
    this.yearlist.push(d.getFullYear() - 2);
    this.year = d.getFullYear();
    let userData = JSON.parse(sessionStorage.getItem("uData"));
    this.uid = userData.int_user_id;
    this.monthlyStat();
  }

  monthlyStat() {
    let Sdate = "01/01/" + this.year;
    let EDate = "12/31/" + this.year;
    let cnd =
      " where int_user_id=" +
      this.uid +
      " and (date_trans_date>='" +
      Sdate +
      "' and date_trans_date<='" +
      EDate +
      "')";

    this.authServicesProvider.getRetailerStasticMonthly(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      let val = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let total = 0;
      if (status === "Success") {
        this.data = this.responseData.Data;

        for (let i = 0; i < this.data.length; i++) {
          val[this.data[i].month - 1] = this.data[i].count;
          total = total + this.data[i].count;
        }
      }

      //destroy previous chart
      if (this.barChart !== null) this.barChart && this.barChart.destroy();

      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12"
          ],
          datasets: [
            {
              label: "# of Redeem",
              data: val,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(34,139,34,0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(34,139,34,1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: 10,
                  stepSize: 25
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Total Redeem : " + total
                  // fontColor: "#C7C7CC",
                  // fontSize: 11
                }
              }
            ]
          }
        }
      });
    });
    this.catgoryStat();
  }

  catgoryStat() {
    let Sdate = "01/01/" + this.year;
    let EDate = "12/31/" + this.year;
    let cnd =
      " where user_id=" +
      this.uid +
      " and (trans_date>='" +
      Sdate +
      "' and trans_date<='" +
      EDate +
      "')";

    this.authServicesProvider.getMemberStasticCategory(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      let val = [];
      let lab = [];
      let lcolor = [];
      let lbcolor = [];
      let total = 0;
      if (status === "Success") {
        this.data = this.responseData.Data;

        for (let i = 0; i < this.data.length; i++) {
          val.push(this.data[i].Count);
          lab.push(this.data[i].cat_name);
          lcolor.push(this.color[i]);
          lbcolor.push(this.bordercolor[i]);
          total = total + this.data[i].Count;
        }
      }

      if (this.barChartCat != null) this.barChartCat.destroy();
      this.barChartCat = new Chart(this.barCanvasCat.nativeElement, {
        type: "bar",
        data: {
          labels: lab,
          datasets: [
            {
              label: "# of Redeem",
              data: val,
              backgroundColor: lcolor,
              borderColor: lbcolor,
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: 10,
                  stepSize: 25
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Total Redeem : " + total
                  // fontColor: "#C7C7CC",
                  // fontSize: 11
                }
              }
            ]
          }
        }
      });
    });
    this.catgorySavingStat();
  }

  catgorySavingStat() {
    let Sdate = "01/01/" + this.year;
    let EDate = "12/31/" + this.year;
    let cnd =
      " where user_id=" +
      this.uid +
      " and (trans_date>='" +
      Sdate +
      "' and trans_date<='" +
      EDate +
      "')";

    this.authServicesProvider.getMemberStasticCategory(cnd).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      let val = [];
      let lab = [];
      let lcolor = [];
      let lbcolor = [];
      let total = 0;
      if (status === "Success") {
        this.data = this.responseData.Data;

        for (let i = 0; i < this.data.length; i++) {
          val.push(this.data[i].Total);
          lab.push(this.data[i].cat_name);
          lcolor.push(this.color[i]);
          lbcolor.push(this.bordercolor[i]);
          total = total + this.data[i].Total;
        }
      }

      if (this.barChartSaving != null) this.barChartSaving.destroy();
      this.barChartSaving = new Chart(this.barCanvasCatSaving.nativeElement, {
        type: "bar",
        data: {
          labels: lab,
          datasets: [
            {
              label: "$ of Saving",
              data: val,
              backgroundColor: lcolor,
              borderColor: lbcolor,
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: 100,
                  stepSize: 500
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Total Saving : $" + total
                  // fontColor: "#C7C7CC",
                  // fontSize: 11
                }
              }
            ]
          }
        }
      });
    });
  }

  changeYear() {
    this.monthlyStat();
  }
}
