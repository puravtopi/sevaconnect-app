import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { LoginPage } from "../login/login";

import { AuthenticationServicesProvider } from '../../providers/authentication-services/authentication-services';
import { CommonServicesProvider } from '../../providers/common-services/common-services';
import { AlertController,NavParams } from 'ionic-angular';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {


  users = {
    name: "", email: "", pass: ""
  }
  
  userData :any;
  typeid:any;
  responseData: any;


  public signuptab = 'personal';

  constructor(public nav: NavController,public navParams: NavParams, public authServicesProvider: AuthenticationServicesProvider,
  public commonServicesProvider: CommonServicesProvider,public alertCtrl:AlertController) {

  this.typeid= navParams.get('typeid');

    
  }

  // register and go to home page
  register() {

    this.authServicesProvider.consumenrSignUPServices(this.users.name,this.users.email,this.users.pass, this.typeid).then(result => {
      this.responseData = result;
      let status = this.responseData.Status;
      if (status == "success") {
        this.userData = this.responseData.UserData;
        //this.commonServicesProvider.alertMessage("SevaConnect","Congratulation !! your are registered successfully.")
      
   let alert = this.alertCtrl.create({
    title: 'SevaConnect',
    message: 'Congratulation !! your are registered successfully.Click "OK" for Login.',
    buttons: [
     
      {
        text: 'OK',
        handler: () => {
         this.login();
        }
      }
    ]
  });
  alert.present();  
  }
      else{
          this.commonServicesProvider.alertMessage("SevaConnect","Sorry !! there was an issue to create your account.")
      }
    });

    //this.nav.setRoot(HomePage);
  }

  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }
 
}
