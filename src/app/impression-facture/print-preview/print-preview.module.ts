
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintPreviewComponent } from './print-preview.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {QriousModule} from 'angular-qrious';






@NgModule({
  declarations: [PrintPreviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonicModule,
    QriousModule
  ]
})
export class PrintPreviewModule { }

