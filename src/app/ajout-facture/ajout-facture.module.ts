import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjoutFacturePageRoutingModule } from './ajout-facture-routing.module';

import { AjoutFacturePage } from './ajout-facture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjoutFacturePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AjoutFacturePage]
})
export class AjoutFacturePageModule {}
