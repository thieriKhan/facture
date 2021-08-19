import { ItemsService } from "./../services/items.service";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { BehaviorSubject, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { FacturesService } from '../services/factures.service';
// import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { Platform, ModalController, AlertController, IonCheckbox, IonItemSliding,
   ToastController, LoadingController, GestureController } from '@ionic/angular';
import { finalize, tap, catchError } from 'rxjs/operators';
import { Router, RouterOutlet } from '@angular/router';
import { PrintPreviewComponent } from './print-preview/print-preview.component';
import { Client, Facture, UpdateFacture } from '../containers';
import { StorageService } from '../services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';
import { ProduitComponent } from '../components/produit/produit.component';
import { IonRouterOutlet } from '@ionic/angular';
import { ModalBaseComponent } from '../components/modal-base/modal-base.component';




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
displayCheckbox= false;
deleteItem = false;
selectedC;
idC;


facturation: Observable<Facture[]>;


  constructor(
    private routerOutlet: IonRouterOutlet,
    private fact: FacturesService,
    private formBuilder: FormBuilder,

    private platform: Platform,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: StorageService,
    private toastC: ToastController,
    private loadC: LoadingController,
    private item : ItemsService
  ) {
    this.alertInterface = {
      cssClass: 'alert',
      backdropDismiss: true,
      animated: true
    };

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
      this.deleteItem = false;

      if(!this.fact.printItemID.includes(event.detail.value)){
      this.fact.printItemID.push(event.detail.value);
      }
    }else{
      this.fact.printItemID.splice(this.fact.printItemID.indexOf(event.detail.value),1);
    }

  }
  // async print(client) {
  //   this.fact.selectedclient = client;

  //  const ch =  document.querySelectorAll('ion-checkbox');

 // previous implementation of print function

    //  if(this.platform.is('android') || this.platform.is('ios') ){
    //   this.printMobile();
    //  }else{
    //   this.printWeb();
    //  }
    //  window.location.reload();


  //   const detailPage = await this.modalCtrl.create({

  //     component: ModalBaseComponent,

  //   });
  //    detailPage.present();
  // }

  async ionViewWillEnter(){


   const client = (await this.fact.getClient())
     .pipe(
       tap((data: Client[]) => {

         const dat = data.find((item: Client) => String(item.id) === this.idC);
         if(dat){
           this.selectedC = dat.name;
            console.log(this.selectedC);
         }


       })
     );
   this.clients = client;

   }

  async ionViewDidEnter(){
     this.fact.selectedclient = this.clientSelected;



   }

  async edit2(){
     const modal =  await this.modalCtrl.create(
       {
         component: ProduitComponent
       }
     );
     modal.present();
   }
  async  edit(id: number,  checked: IonCheckbox, slide: IonItemSliding){
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
      },
      {
      name:'packaging',
      placeholder: 'packaging',
      type: 'text',
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

          const toast = await this.toastC.create({
            message: 'desole cette facture n\' pas ete modifie',
            cssClass: 'errorToast'
          });
          const load =  await this.loadC.create(
            {
              spinner: 'bubbles',
              cssClass: 'loadingClass',

            }
          );
          load.present();

          if(data.quantite.length !== 0){
            const up = (await  this.fact.updateFacture(id, data.quantite)).pipe(
              finalize(
                ()=>{
                  load.dismiss();
                }
              )
            );
            up.subscribe(
              async ()=>
            {
             this.facturation = await this.fact.getFacture(this.fact.currentClient);
            },

            async (error)=>{
               toast.present();
            if(error.status !== 403){
              let dt:   UpdateFacture[] = [];
               dt = JSON.parse( await this.storage.get('unupdated')) || [];
               const val = {id  , quantite: data.quantite};
               if(!dt.includes(val)){
                 dt.push(val);
               }
             await this.storage.set('unupdated',JSON.stringify(dt));
              }
            }


            );
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
            const toast = this.toastC.create({
              message: 'desole cette facture n\' pas ete supprime',
              cssClass: 'errorToast'
            });
            const load =  await this.loadC.create(
              {
                spinner: 'bubbles',
                cssClass: 'loadingClass',

              }
            );
            load.present();
            const del = (await this.fact.deleteFacture(id)).pipe(
              finalize(()=>{
                load.dismiss();
              })
            );
            del.subscribe(
              async ()=>
         {
          this.facturation = await this.fact.getFacture(this.fact.currentClient);
         },
         async (error)=>{
           (await toast).present();
         if(error.status !== 403){
           let dt: any[] = [];
            dt = JSON.parse( await this.storage.get('undeleted')) || [];
            if(!dt.includes(id)){
              dt.push(id);
            }
          await this.storage.set('undeleted',JSON.stringify(dt));
         }
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


