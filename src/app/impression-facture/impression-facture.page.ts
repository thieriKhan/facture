import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { BehaviorSubject, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { FacturesService } from '../services/factures.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import {Platform, ModalController, AlertController, IonCheckbox, IonItemSliding} from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PrintPreviewComponent } from './print-preview/print-preview.component';
import { Facture } from '../containers';


export interface Produit {
  produit: string;


}
@Component({
  selector: 'app-impression-facture',
  templateUrl: './impression-facture.page.html',
  styleUrls: ['./impression-facture.page.scss'],
})
export class ImpressionFacturePage implements OnInit {
  alertInterface;
clientFom: FormGroup;
trackBy;
testons: Facture[];
clients: Observable<any>;
clientSelected: any;
client: Observable<any>;
icon = 'list';
content = true;
test;


facturation: Observable<Facture[]>;


  constructor(
    private fact: FacturesService,
    private formBuilder: FormBuilder,
    private printer: Printer,
    private platform: Platform,
    private route: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {

    this.alertInterface = {
      cssClass: 'alertClass',
      backdropDismiss: true,
      animated: true
    };

     }
     load(nom){
       console.log(nom);
       this.trackBy = nom;
     }

  ngOnInit() {

    this.icon = 'list';
    this.clientFom = this.formBuilder.group(
      {choix: ['']}
    );


  }

  printView(){
    this.icon = this.icon ==='list'? 'calendar': 'list';
    this.content = this.icon ==='list'? true: false;
  }

  changed(event){

if(event.detail.checked){
  if(!this.fact.printItemID.includes(event.detail.value)){
    this.fact.printItemID.push(event.detail.value);
  }
}else{

  this.fact.printItemID.splice(this.fact.printItemID.indexOf(event.detail.value),1);


}



  }
  async print(client) {
    this.fact.selectedclient = client;

   const ch =  document.querySelectorAll('ion-checkbox');

 // previous implementation of print function

    //  if(this.platform.is('android') || this.platform.is('ios') ){
    //   this.printMobile();
    //  }else{
    //   this.printWeb();
    //  }
    //  window.location.reload();


    const printView = await this.modalCtrl.create({
      backdropDismiss: true,
      showBackdrop: true,
      component: PrintPreviewComponent,
    });
     printView.present();
  }

  async ionViewWillEnter(){
   this.clients = await  (await this.fact.getClient());
   }

  async ionViewDidEnter(){
     this.fact.selectedclient = this.clientSelected;
   }
  async  edit(id,  checked: IonCheckbox, slide: IonItemSliding){
    slide.close();
   const alert = await  this.alertCtrl.create({
    header: 'modification',
    cssClass: 'alert',
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
        text: 'fermer',
        role: 'cancel'
      },
      {
        text: 'modifier',
        handler: async (data)=>{

          if(data.quantite.length !== 0){
            const up = await  this.fact.updateFacture(id, data.quantite);
            up.subscribe(async ()=>
            {
             this.facturation = await this.fact.getFacture(this.fact.currentClient);
            });
          }



        }
      }

    ]
   });
   alert.present();

   }
  async delete(id, slide: IonItemSliding){
    slide.close();
    const alert = await  this.alertCtrl.create({
      header: 'Confirmation',
      cssClass: 'alert',
      message: 'voulez vous vraiment suprimer cette commande?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel'
        },
        {
          text: 'OUI',
          handler: async (data)=>{
            const del = await this.fact.deleteFacture(id);
            del.subscribe(
              async ()=>
         {
          this.facturation = await this.fact.getFacture(this.fact.currentClient);
         }
            );


          }
        }
      ]
     });

     await alert.present();



   }



  async select(event){
     const val = event.detail.value;
     this.fact.currentClient = val;
     this.facturation = await(await this.fact.getFacture(val))
     .pipe(tap(
      (data: Facture[])=>{
       this.testons = data;


      }
    ));
     this.client = await this.fact.getUniqueClient(this.clientSelected);
   }

   track(index, item){

     return item.id;
   }



}


