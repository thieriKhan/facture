import { PaymentComponent } from './payment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class PaymentModule { }
