import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule } from '@angular/common';
import {IonicStorageModule} from '@ionic/storage-angular';

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
    IonicStorageModule.forRoot()
  ],
  providers: [Printer,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
