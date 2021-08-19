import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import { ModalBaseComponent } from './modal-base/modal-base.component';



@NgModule({
  declarations: [ModalBaseComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ModalBaseModule { }
