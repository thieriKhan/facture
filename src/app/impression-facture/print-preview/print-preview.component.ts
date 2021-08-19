import { ItemsService } from './../../services/items.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import { FacturesService } from '../../services/factures.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { DomController, ModalController, Platform, AlertController, NavParams } from '@ionic/angular';
import {  Order, Produit } from 'src/app/containers';


@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss'],
})
export class PrintPreviewComponent implements OnInit {
  @ViewChild('mycontent') mycontent: ElementRef;

  totalsub: Subject<any>= new Subject();
  total: Observable<any> = this.totalsub.asObservable();
  date = Date.now();
  totalFac;
  nomC: Observable<string>;
  clientOrders: Order[];
  products: Produit[];
  client;
  props;
  totalTtc;
  qrData;
  navData;


  constructor(
     private fact: FacturesService,
     private platform: Platform,
     private printer: Printer,
     private domc: DomController,
     private renderer: Renderer2,
     private modalCtrl: ModalController,
     private alertCtrl: AlertController,
     private navParam: NavParams,
     private item: ItemsService
    ) {

     }

 async ngOnInit() {


const  navdata = this.navParam.data;
this.navData = navdata
 this.totalFac = navdata.totalHT;
 this.totalTtc = navdata.totalTTC;
 if(navdata.isMecfInvoiceGeneRated){
  this.qrData = navdata.meceCodeData;
 }




  }
  ionViewWillEnter(){
    this.nomC = this.item.currentClient;
    this.clientOrders = this.item.allCurrentClientsOrders.find(item => item.idClient = this.item.currentClintid).orders;
    this.products=  this.item.allProducts;


  }



  closeModal(){
    this.modalCtrl.dismiss();
  }

 async print(){
 // previous implementation of print function

            if(this.platform.is('android') || this.platform.is('ios') ){
              this.printMobile();

             }else{
              this.printWeb();
        }


  }

async  printMobile(){
  this.printer.isAvailable().then(
    ()=> {console.log('printer is available');},
    (error)=> {console.log('printer is not available', error)}
  )


   const content = document.getElementsByClassName('print')[0].innerHTML;
   const  options: PrintOptions = {
    name: 'MyDocument',
    duplex: true,
    orientation: 'landscape',
    monochrome: true,

};
this.printer.print(content, options);




   }

   printWeb(){

    const myBody = document.body.innerHTML;
    const printID = document.getElementsByClassName('print')[0].innerHTML;
    document.body.innerHTML =  printID;
    window.print();
    document.body.innerHTML = myBody;
    window.location.reload();

  }







  getProduit(id){
    return this.products.find(item => item.id === id);
  }


}
