import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjoutFacturePageRoutingModule } from './ajout-facture-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AjoutFacturePage } from './ajout-facture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjoutFacturePageRoutingModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  declarations: [AjoutFacturePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AjoutFacturePageModule {}
