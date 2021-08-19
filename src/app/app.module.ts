import { PopoverModule } from './components/popover/popover.module';
import { PrintPreviewModule } from './impression-facture/print-preview/print-preview.module';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule } from '@angular/common';
import {IonicStorageModule} from '@ionic/storage-angular';
import { Network } from '@ionic-native/network/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Printer} from '@ionic-native/printer/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HistoriquePipe } from './historique.pipe';

@NgModule({
  declarations: [AppComponent, HistoriquePipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),
   AppRoutingModule, NgxDatatableModule,
    HttpClientModule, CommonModule,
    IonicStorageModule.forRoot(),
    PrintPreviewModule,
    PopoverModule
  ],
  providers: [Printer,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Network],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
