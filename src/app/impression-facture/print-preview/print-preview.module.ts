import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintPreviewComponent } from './print-preview.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



@NgModule({
  declarations: [PrintPreviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule
  ]
})
export class PrintPreviewModule { }
