import { PrintPreviewComponent } from './../../impression-facture/print-preview/print-preview.component';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  nextPage = PrintPreviewComponent;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  // closeModal(){
  //   this.modalCtrl.dismiss();

  // }
//  async next(){
//    this.closeModal();
//     const nextModal = await this.modalCtrl.create({
//       component: PrintPreviewComponent,
//       backdropDismiss: true,
//       showBackdrop: true,
//       animated: false
//     });

//     nextModal.present();
//   }

}
