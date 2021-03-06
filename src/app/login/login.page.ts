import { LoginService } from './../services/login.service';
import { StorageService } from './../services/storage.service';
import { Subscription, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';

import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit, OnDestroy {
  isVisible: string;
  mytype: string;
  url = '../assets/photo_2020-12-19_22-55-09.jpg';
  loginForm: FormGroup;
  loginSubscription:  Subscription = new Subscription();
  token: any;



  constructor(
    private storage: StorageService,
     private formBuilder: FormBuilder,
     private loadingCtrl: LoadingController,
      private http: HttpClient,
       private route: Router,
       private log: LoginService,
       private alertCtrl: AlertController) {

  }

 async  changeBaseUrl(){
    const alert =  await this.alertCtrl.create({
      header: 'l\'api de base',

      cssClass: 'alert',
      inputs: [
        {
          name: 'url',
          type: 'text',
          placeholder: 'url',

        }
      ],
      buttons: [
        {
          text: 'fermer',
          role: 'cancel'
        },
        {
          text: 'changer',
          handler: async (data)=>{
            if(!(data.url.length === 0)){
              await this.storage.set('url', data.url);
            }
            alert.dismiss();
          }
        }
      ]
  });
  alert.present();
}
  initLoginForm(){
    this.loginForm = this.formBuilder.group({
      phone : [''],
      code : [''],

    });
  }
  async onSubmitForm(){
   this.loginSubscription =  await this.log.login(this.loginForm);
   const user = this.loginForm.get('phone').value;
   this.storage.set('user', user);
  }
  ontogleHide(){
    this.mytype = (this.mytype === 'text')? 'password':'text';
    this.isVisible =  (this.mytype === 'text')? 'eye-off': 'eye';
  }


  ionViewWillEnter(){
    this.mytype = 'password';
    this.isVisible = 'eye';

  }



  ngOnInit() {
    this.initLoginForm();
  }
  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

}
