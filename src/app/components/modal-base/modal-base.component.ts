import { Component, OnInit, ViewChild } from '@angular/core';
import { IonNav, NavParams, AlertController } from '@ionic/angular';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { PaymentComponent } from '../payment/payment.component';
import { PrintPreviewComponent } from '../../impression-facture/print-preview/print-preview.component';
import { Console } from 'console';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrls: ['./modal-base.component.scss'],
})
export class ModalBaseComponent implements OnInit {
  @ViewChild ('nav', {static: true}) myNav: IonNav;
  level: 0;
  rootPage = OrderDetailComponent;
  data;
  constructor(
    private navParam: NavParams,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // setTimeout(() => {
    //   console.log('before');
    //   this.pushToNav();
    //   console.log('pushed');
    // }, 5000);
    this.data = this.navParam.data;

  }
//  async leave(ev: IonNav){


//   if( (await ev.getActive()).component === OrderDetailComponent){
//   const alert = await   this.alertCtrl.create({
//       header: 'my alert',
//       message: 'hello alert controller',
//       buttons: [
//         {
//           text: 'cancel',
//         role: 'cancel'}
//       ]
//     });
//     alert.present();

//   }
// }

// ionViewWillEnter(){
//   console.log('bonjour')
//   setTimeout(() => {
//     console.log('before');
//     this.pushToNav();
//     console.log('pushed');
//   }, 500);

// }
  // ionViewDidEnter(){
  //  this.myNav.setRoot(this.rootPage);
  //   setTimeout(() => {
  //     console.log('before');
  //     this.pushToNav();
  //     console.log('pushed');
  //   }, 500);
  // }
  // private pushToNav() {
  //   const otherPage = PaymentComponent;
  //   this.myNav.push(otherPage, {level: this.level + 1});
  //  }
  // private popFromNav() {
  //   this.myNav.pop();
  // }

}
