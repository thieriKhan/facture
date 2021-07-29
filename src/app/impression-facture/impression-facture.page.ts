import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { BehaviorSubject, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { FacturesService } from '../services/factures.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import {Platform, ModalController, AlertController, IonCheckbox} from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PrintPreviewComponent } from './print-preview/print-preview.component';


export interface Produit {
  produit: string;


}
@Component({
  selector: 'app-impression-facture',
  templateUrl: './impression-facture.page.html',
  styleUrls: ['./impression-facture.page.scss'],
})
export class ImpressionFacturePage implements OnInit {
clientFom: FormGroup;
clients: Observable<any>;
clientSelected: any;
client: Observable<any>;
icon = 'calendar';
content = true;
test;

facturation: Observable<any>;


  constructor(
    private fact: FacturesService,
    private formBuilder: FormBuilder,
    private printer: Printer,
    private platform: Platform,
    private route: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {



     }

  ngOnInit() {
    this.icon = 'calendar';
    this.clientFom = this.formBuilder.group(
      {choix: ['']}
    );


  }

  printView(){
    this.icon = this.icon ==='list'? 'calendar': 'list';
    this.content = this.icon =='calendar'? true: false;
  }

  changed(event){
console.log('ev', event.detail.checked, event.detail.value);
if(event.detail.checked){
  if(!this.fact.printItemID.includes(event.detail.value)){
    this.fact.printItemID.push(event.detail.value);
  }
}else{

  // this.fact.printItemID.splice(this.fact.printItemID[event.detail.value] );
  console.log(event.detail.value);
  console.log('index', this.fact.printItemID.indexOf(event.detail.value));


}
console.log(this.fact.printItemID);


  }
  async print() {

   const ch =  document.querySelectorAll('ion-checkbox');

 // previous implementation of print function

    //  if(this.platform.is('android') || this.platform.is('ios') ){
    //   this.printMobile();
    //  }else{
    //   this.printWeb();
    //  }
    //  window.location.reload();


    const printView = await this.modalCtrl.create({
      component: PrintPreviewComponent
    });
     printView.present();
  }

  async ionViewWillEnter(){
   this.clients = await  this.fact.getClient();

   }
   async ionViewDidEnter(){
    this.facturation = await this.fact.getFacture(this.clientSelected);
   }
  async  edit(id,  checked: IonCheckbox){
    console.log('checked', checked);
   const alert = await  this.alertCtrl.create({
    header: 'modification',
    inputs: [
      {
        name: 'quantite',
        placeholder: 'quantite',
        type: 'number',
        min: '1'
      }
    ],
    buttons: [
      {
        text: 'ok',
        handler: async (data)=>{
         const up = await  this.fact.updateFacture(id, data.quantite);
         up.subscribe();
        console.log('facture num:');

        }
      },
      {
        text: 'close',
        role: 'cancel'

      }
    ]
   });
   alert.present();
   }
  async delete(id){
   const del = await this.fact.deleteFacture(id);
   del.subscribe();

   }


   printMobile(){
    const content = document.getElementById('maTable').innerHTML;
    this.printer.isAvailable().then(
      ()=>{ console.log('printer is available');},
     (error)=>{console.log('printer is not availabe', error);
      }
     );
    const  options: PrintOptions = {
         name: 'MyDocument',
         duplex: true,
         orientation: 'landscape',
         monochrome: false
    };
    this.printer.print(content, options);
   }
   printWeb(){
     const myBody = document.body.innerHTML;

      document.body.innerHTML =  document.getElementsByClassName('list')[0].innerHTML;


     window.print();
     document.body.innerHTML = myBody;

   }

  async select(event){
     const val =event.detail.value;
     console.log(event);
     this.facturation = await this.fact.getFacture(val);
     this.client = await this.fact.getUniqueClient(this.clientSelected);
   }





}


