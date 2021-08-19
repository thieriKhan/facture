import { BaseModule } from "./components/base/base.module";
import { PopoverModule } from './components/popover/popover.module';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
// import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule } from '@angular/common';
import {IonicStorageModule} from '@ionic/storage-angular';
import { Network } from '@ionic-native/network/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Printer} from '@ionic-native/printer/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HistoriquePipe } from './historique.pipe';
import { ModalBaseModule } from './components/modal-base.module';
import { OrderDetailModule } from './components/order-detail/order-detail.module';
import { PaymentModule } from './components/payment/payment.module';
import { PrintPreviewModule } from './impression-facture/print-preview/print-preview.module';
import { ProduitModule } from './components/produit/produit.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';




@NgModule({
  declarations: [AppComponent, HistoriquePipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),
   AppRoutingModule,
    HttpClientModule, CommonModule,
    IonicStorageModule.forRoot(),
    ModalBaseModule,
    BaseModule,
    OrderDetailModule,
    PopoverModule,
    PaymentModule,
    PrintPreviewModule,
    ProduitModule,
    Ng2SearchPipeModule,


  ],
  providers: [ Printer, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Network],
  bootstrap: [AppComponent]
})
export class AppModule { }
