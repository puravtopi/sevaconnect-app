import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Chart } from "chart.js";
import { AuthenticationServicesProvider } from "../../providers/authentication-services/authentication-services";

/**
 * Generated class for the RetStatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-ret-statistics",
  templateUrl: "ret-statistics.html"
})
export class RetStatisticsPage implements OnInit {
  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("barCanvasGender") barCanvasGender: ElementRef;
  public responseData: any;
  public resultData: any;
  public data: any;
  public yearlist: any = [];
  public year: any;
  public total: any = 0;
  private barChart: Chart;
  private barChartGender: Chart;
  private uid: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authServicesProvider: AuthenticationServicesProvider
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    let d = new Date();

    this.yearlist.push(d.getFullYear());
    this.yearlist.push(d.getFullYear() - 1);
    this.yearlist.push(d.getFullYear() - 2);
    this.year = d.getFullYear();

    let userData = JSON.parse(sessionStorage.getItem("uData"));
    this.uid = userData.int_retailer_id;

    this.monthlyStat();
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad RetStatisticsPage");
  }

  monthlyStat() {
    let Sdate = "01/01/" + this.year;
    let EDate = "12/31/" + this.year;
    let cnd =
      " where int_retailer_id=" +
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
      if (status === "Success") {
        this.data = this.responseData.Data;

        for (let i = 0; i < this.data.length; i++) {
          val[this.data[i].month - 1] = this.data[i].count;
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
            ]
          }
        }
      });
    });

    this.genderStat();
  }

  genderStat() {
    let Sdate = "01/01/" + this.year;
    let EDate = "12/31/" + this.year;
    let param =
      "count(case when str_gender='Male' then 1 end) as Male,count(case when str_gender = 'Female' then 1 end) as Female,";
    let cnd =
      " where int_retailer_id=" +
      this.uid +
      " and (date_trans_date>='" +
      Sdate +
      "' and date_trans_date<='" +
      EDate +
      "')";

    this.authServicesProvider
      .getRetailerStasticGender(cnd, param, "int_retailer_id")
      .then(result => {
        this.responseData = result;
        let status = this.responseData.Status;
        let val = [0, 0];
        if (status === "Success") {
          this.data = this.responseData.Data;

          val[0] = this.data[0].Male;
          val[1] = this.data[0].Female;
          this.total = this.data[0].total;
        }
        //destroy previous chart
        if (this.barChartGender !== null)
          this.barChartGender && this.barChartGender.destroy();
        this.barChartGender = new Chart(this.barCanvasGender.nativeElement, {
          type: "bar",
          data: {
            labels: ["Male", "FeMale"],
            datasets: [
              {
                label: "# of Redeem",
                data: val,
                backgroundColor: [
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 99, 132, 0.2)"
                ],
                borderColor: ["rgba(54, 162, 235, 1)", "rgba(255,99,132,1)"],
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
