import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import { IonicModule } from '@ionic/angular';

import { ImpressionFacturePageRoutingModule } from './impression-facture-routing.module';

import { ImpressionFacturePage } from './impression-facture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImpressionFacturePageRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  declarations: [ImpressionFacturePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImpressionFacturePageModule {}
