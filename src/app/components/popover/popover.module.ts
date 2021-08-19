import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PopoverComponent } from './popover.component';



@NgModule({
  declarations: [ PopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule]

})
export class PopoverModule { }
