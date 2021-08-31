import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { FacturesService } from './services/factures.service';
import { StorageService } from './services/storage.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {SplashScreen} from '@capacitor/splash-screen'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private plateform : Platform

  ) {}
ngOnInit(){
  this.plateform.ready().then(
    ()=>{
     SplashScreen.hide();
    SplashScreen.show({
  autoHide: false
    });

    }
  );






  }


}
