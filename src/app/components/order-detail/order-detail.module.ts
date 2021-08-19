import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail.component';
// import { PaymentComponent } from '../payment/payment.component';
// import { PrintPreviewComponent } from '../../impression-facture/print-preview/print-preview.component';
import { IonicModule, IonNav } from '@ionic/angular';



@NgModule({
  declarations: [OrderDetailComponent],

  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [IonNav],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderDetailModule { }
