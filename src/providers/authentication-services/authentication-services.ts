import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

/*
  Generated class for the AuthenticationServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationServicesProvider {
  apiUrl = "http://localhost:4993/Service.asmx/";
  //apiUrl = "http://seva-services.sevasocial.org/service.asmx/";

  constructor(public http: Http) {
    console.log("Hello AuthenticationServicesProvider Provider");
  }

  loginServices(uname, password, lid) {
    let method = "CheckLogin";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: { uname: uname, password: password, logintype: lid }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  forgotPasswordServices(uname, lid) {
    let method = "ForgotPassword";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: { uname: uname, logintype: lid }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getAllStateServices() {
    let method = "GetStateList";

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + method, { params: { cnd: "" } }).subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getCitiesServices(stateid) {
    let method = "GetCityList";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, { params: { stateid: stateid } })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getOrgTypeServices(cnd) {
    let method = "GetOrganizationTypeList";

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + method, { params: { cnd: cnd } }).subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getOrgServices(cnd) {
    let method = "GetOrganizationList";

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + method, { params: { cnd: cnd } }).subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getOrgBio(orgid) {
    let method = "GetOrgBio";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, { params: { orgid: orgid } })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getRetBio(retid) {
    let method = "GetRetBio";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, { params: { retid: retid } })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  updateOrgBio(orgid, bio) {
    let method = "UpdateOrgBio";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            orgid: orgid,
            bio: bio
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  updateRetBio(retid, bio) {
    let method = "UpdateRetBio";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            retid: retid,
            bio: bio
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getRetailerStasticMonthly(cnd) {
    let method = "RetailerMonthlyTransaction";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            cnd: cnd
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getRetailerStasticGender(cnd, param, grp) {
    let method = "RetailerGenderTransaction";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            cnd: cnd,
            param: param,
            grp: grp
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getMemberStasticCategory(cnd) {
    let method = "ConsumerCategoryTransaction";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            cnd: cnd
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getMemberStasticCategorySaving(cnd) {
    let method = "ConsumerCategorySavingTransaction";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            cnd: cnd
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }
  updateRetProfile(
    retid,
    street_address,
    city_id,
    state_id,
    zip_code,
    retailer_name,
    corporate_name
  ) {
    let method = "RetailerProfileUpdate";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            retailer_id: retid,
            street_address: street_address,
            city_id: city_id,
            state_id: state_id,
            zip_code: zip_code,
            retailer_name: retailer_name,
            corporate_name: corporate_name
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getRetailerProfileServices(retid) {
    let method = "RetailerProfile";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, { params: { retid: retid } })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getOrgnizationProfileServices(orgid) {
    let method = "OrgnizationProfile";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, { params: { orgid: orgid } })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  updateOrgProfile(
    org_id,
    street_address,
    city_id,
    state_id,
    zip_code,
    org_name,
    corporate_name
  ) {
    let method = "OrgProfileUpdate";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            org_id: org_id,
            street_address: street_address,
            city_id: city_id,
            state_id: state_id,
            zip_code: zip_code,
            org_name: org_name,
            corporate_name: corporate_name
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getCatServices() {
    let method = "GetCategoryList";

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + method).subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getSubCatServices(cnd) {
    let method = "GetSubCategories";

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + method, { params: { cnd: cnd } }).subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getRetailerPin(retailerId) {
    let method = "GetPin";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, { params: { retailerId: retailerId } })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getOffersServices(cnd, pageIndex, pageSize, sortorder, columname) {
    let method = "GetOfferDetails";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            cnd: cnd,
            pageIndex: pageIndex,
            pageSize: pageSize,
            sortorder: sortorder,
            columname: columname
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getDailyDealsServices(cnd, pageIndex, pageSize, sortorder, columname) {
    let method = "GetAllDailyDeals";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            cnd: cnd,
            pageIndex: pageIndex,
            pageSize: pageSize,
            sortorder: sortorder,
            columname: columname
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getFeaturedDealsServices(cnd, pageIndex, pageSize, sortorder, columname) {
    let method = "GetAllFeatureDeals";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            cnd: cnd,
            pageIndex: pageIndex,
            pageSize: pageSize,
            sortorder: sortorder,
            columname: columname
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getSavingPurchaseDataServices(userid) {
    let method = "GetSavingData";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, { params: { userid: userid } })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  getTransactionServices(cnd) {
    let method = "GetTransactionList";

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + method, { params: { cnd: cnd } }).subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getOfferCommentsServices(cnd) {
    let method = "GetOfferCommentsList";

    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + method, { params: { cnd: cnd } }).subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          reject(err);
        }
      );
    });
  }

  consumenrSignUPServices(name, emailid, password, typeid) {
    let method = "";
    if (typeid == 1) method = "MemberSignup";
    else method = "MerchantSignup";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: { name: name, emailid: emailid, password: password }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  updateDetailsServices(userid, address, stateid, cityid, zipcode, orgid) {
    let method = "UpdateDetails";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            int_user_id: userid,
            str_street_address: address,
            int_city_id: cityid,
            int_state_id: stateid,
            int_zip_code: zipcode,
            int_organization_id: orgid
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  insertCommentsServices(
    retailerid,
    userid,
    rate,
    review,
    offerid = 0,
    dealid = 0,
    fdealid = 0
  ) {
    let method = "InsertOffersComments";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            int_user_id: userid,
            dec_rate: rate,
            int_retailer_id: retailerid,
            str_review: review,
            int_offer_id: offerid,
            int_deal_id: dealid,
            int_f_deal_id: fdealid
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }

  saveTransactionServices(
    userid,
    retailerid,
    offerid,
    shareamt,
    purchaseamt,
    totalsaving,
    marketingAmt,
    redeemNo,
    int_service_provider_id,
    int_deal_id,
    int_f_deal_id
  ) {
    let method = "InsertTransaction";

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + method, {
          params: {
            int_user_id: userid,
            int_retailer_id: retailerid,
            int_offer_id: offerid,
            int_no_redeem: redeemNo,
            dec_share_amount: shareamt,
            dec_puchase_amt: purchaseamt,
            str_receipt: "1234",
            dec_total_saving: totalsaving,
            dec_marketing_fee: marketingAmt,
            int_service_provider_id: int_service_provider_id,
            int_deal_id: int_deal_id,
            int_f_deal_id: int_f_deal_id
          }
        })
        .subscribe(
          res => {
            resolve(res.json());
          },
          err => {
            reject(err);
          }
        );
    });
  }
}
